const { GoogleGenAI } = require("@google/genai");
const Plan = require("../models/Plan");

const generateQuestion = async (req, res) => {
  try {
    const { topic } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    const prompt = `
The user wants to learn **${topic}**.  
Your task is to generate a **dynamic and adaptive questionnaire** that will help create a personalized learning plan for this subject.

### Follow These Rules:

1. Generate questions as a **formFields array** in valid JSON format.
2. Questions must adapt to the subject.  
   - Example: If subject = "DSA", include fields like preferred languages, problem-solving level.  
   - If subject = "Operating Systems", include fields like OS familiarity, core concepts, etc.
3. Always include the essential baseline questions:
   - experience
   - role
   - jobTitle
   - companies
   - currentProficiency
   - focusArea
   - skillLevel
   - topics
   - complexity
   - industry
4. You may **add, remove, or modify** fields to match the subject intelligently.
5. Each field must follow this structure:
6. if question is "what is your experience?" then name field should be "userexperience" , if question is "What is your main goal for learning OS?" then name field should be "userlearningGoal".
7. options field should not be objects.

{
  "name": "...",
  "label": "...",
  "type": "text" | "number" | "select",
  "placeholder": "...",
  "options": [...],        // only for select
  "required": true | false
}

### Output Format:
Return ONLY the JSON array:
[
  { ...field1 },
  { ...field2 },
  ...
]

### Example (for reference only):
A formFields array with fields like subject, experience, role, jobTitle, companies, currentProficiency, focusArea, skillLevel, topics, complexity, industry.

### Important:
- Do NOT explain anything.
- Do NOT include extra text.
- Only return the final JSON array.

Now generate the **dynamic questionnaire** for the subject: "${topic}".
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });
    // console.log(result.text);
    if (!result || !result.text) {
      throw new Error("No valid response from Google API.");
    }
    const generatedText = await result.text;
    const cleanedText = generatedText.replace(/```json\n|\n```/g, '');
    const jsonData = JSON.parse(cleanedText);

    // console.log("Json Data :=> ", jsonData);
    res.json(jsonData);
  } catch (error) {
    console.log("error in generateQuesrion", error);
  }
}


const generatePlan = async (req, res) => {
  let { topic, userQuestionAnswerResponse } = req.body;
  console.log("response", topic, userQuestionAnswerResponse);
  if (!userQuestionAnswerResponse) {
    return res.status(400).json({ error: "User question and answer response is required" });
  }
  const duration = Number(userQuestionAnswerResponse?.formValues?.userPlanDuration) || 2;

  const prompt = `
You are an expert personalized learning coach and curriculum designer.
A user filled out this questionnaire (Q/A). Use that input to generate a personalized study plan.

--- USER Q&A ---
${userQuestionAnswerResponse}

--- INSTRUCTIONS ---
1. Produce a valid JSON object and ONLY return the JSON (no explanations, no markdown).
2. JSON MUST have this exact structure:
{
  "submittedInformation": { /* here key:value pair should be subject: "${topic}" */ },
  "plan": {
    "week1": { "topicsCovered": [...], "exercises": [...], "difficultyLevel":"", "timeCommitment":"", "resources":[...] },
    "week2": { ... },
    ...
    "weekN": { ... }
  }
}
3. 3. Create EXACTLY ${duration} weeks.
- If you generate more than ${duration} weeks, the response is INVALID.
- Do NOT create week${duration + 1} or beyond.
4. Tailor topics, exercises and resources to the subject and user's proficiency.
5. For resources include at least 1 free tutorial/link or platform (e.g., "LeetCode", "GeeksforGeeks", "freeCodeCamp", "Official Docs"). Short URLs or resource names are fine.
6. Use difficultyLevel values: "Beginner", "Intermediate", or "Advanced".
7. timeCommitment should be human readable (e.g., "1-2 hours/day", "10 hours/week").
8. Do NOT include any additional keys or any explanatory text outside the JSON.

If any user answer is ambiguous or missing, assume the user wants a balanced intermediate plan.

Return the JSON now.
`
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });
    // console.log(result.text);
    if (!result || !result.text) {
      throw new Error("No valid response from Google API.");
    }

    const generatedText = await result.text;
    const cleanedText = generatedText.replace(/```json\n|\n```/g, '');
    const jsonData = JSON.parse(cleanedText);

    // console.log("Json Data :=> ", jsonData);
    res.json(jsonData);
  } catch (error) {
    console.error("Error generating plan:", error);
    res.status(500).json({ error: "Failed to generate plan" });
  }
};
// Initialize GoogleGenerativeAI with the API key
// Generate content using the provided prompt
// Check if result is properly returned and extract text


function transformPlanToWeeks(planObject) {
  return Object.entries(planObject).map(([weekKey, weekData], index) => ({
    weekNumber: index + 1,
    topicsCovered: weekData.topicsCovered || [],
    exercises: weekData.exercises || [],
    difficultyLevel: weekData.difficultyLevel || "Beginner",
    timeCommitment: weekData.timeCommitment || "",
    resources: weekData.resources || [],
    isCompleted: false,
  }));
}

const savePlan = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.userId;
    const generatedPlan = req.body;

    if (!generatedPlan.plan) {
      return res.status(400).json({ error: "Invalid plan structure" });
    }

    const submittedInformation = generatedPlan.plan.submittedInformation;
    const weekPlanObject = generatedPlan.plan.plan;

    if (!submittedInformation || !weekPlanObject) {
      return res.status(400).json({ error: "Missing submittedInformation or plan" });
    }

    const weeksArray = transformPlanToWeeks(weekPlanObject);

    const newPlan = new Plan({
      userId,
      subject: submittedInformation.subject || "General",
      planDuration: weeksArray.length,
      weeks: weeksArray,
    });

    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);

  } catch (error) {
    console.error("Error saving plan:", error);
    res.status(500).json({ error: "Failed to save plan" });
  }
};


const getPlan = async (req, res) => {
  console.log('Fetching plan for user:', req.userId);
  try {
    const plan = await Plan.find({ userId: req.userId });
    // console.log('Plan data:', plan);
    res.status(200).json(plan);
  } catch (error) {
    console.error('Error getting plan:', error);
    res.status(500).json({ error: 'Failed to get plan' });
  }
}

const deleteplan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    await Plan.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
};
// Find the plan by ID
// If no plan is found, return a 404 response
// If the plan exists, delete it



module.exports = {
  generatePlan, savePlan, getPlan, deleteplan, generateQuestion
};
