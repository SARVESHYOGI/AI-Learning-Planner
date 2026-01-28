class GoogleGenAI {
    constructor() { }

    models = {
        generateContent: async ({ contents }) => {
            const prompt = contents[0].parts[0].text;

            if (prompt.includes("dynamic questionnaire")) {
                return {
                    text: JSON.stringify([
                        {
                            name: "experience",
                            label: "Your experience?",
                            type: "text",
                            required: true,
                        },
                    ]),
                };
            }

            if (prompt.includes("personalized study plan")) {
                return {
                    text: JSON.stringify({
                        submittedInformation: { subject: "DSA" },
                        plan: {
                            week1: {
                                topicsCovered: ["Arrays"],
                                exercises: ["Solve problems"],
                                difficultyLevel: "Beginner",
                                timeCommitment: "1-2 hours/day",
                                resources: ["LeetCode"],
                            },
                            week2: {
                                topicsCovered: ["Strings"],
                                exercises: ["Practice"],
                                difficultyLevel: "Beginner",
                                timeCommitment: "1-2 hours/day",
                                resources: ["GeeksforGeeks"],
                            },
                        },
                    }),
                };
            }

            return { text: "{}" };
        },
    };
}

module.exports = { GoogleGenAI };
