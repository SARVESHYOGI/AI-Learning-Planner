jest.mock("@google/genai");

const request = require("supertest");
const app = require("../app");

describe("AI plan Generator", () => {
    let cookie;

    beforeEach(async () => {
        await request(app).post("/auth/register").send({
            name: "Test",
            email: "plan@test.com",
            password: "123456",
            organization: "TestOrg",
            role: "student",
        });

        const loginRes = await request(app).post("/auth/login").send({
            email: "plan@test.com",
            password: "123456",
        });

        cookie = loginRes.headers["set-cookie"];
        expect(cookie).toBeDefined();
    });

    it("should generate questionnaire (public)", async () => {
        const res = await request(app)
            .post("/plan/generatequestion")
            .set("Cookie", cookie)
            .send({ topic: "DSA" });

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("should generate plan JSON (protected)", async () => {
        const res = await request(app)
            .post("/plan/generate-plan")
            .set("Cookie", cookie)
            .send({
                topic: "DSA",
                userQuestionAnswerResponse: {
                    formValues: { userPlanDuration: 2 },
                },
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("plan");
        expect(res.body).toHaveProperty("submittedInformation");
    });


    it("should save generated plan", async () => {
        const res = await request(app)
            .post("/plan/saveplan")
            .set("Cookie", cookie)
            .send({
                plan: {
                    submittedInformation: { subject: "DSA" },
                    plan: {
                        week1: {
                            topicsCovered: ["Arrays"],
                            exercises: ["Solve"],
                        },
                    },
                },
            });

        expect(res.statusCode).toBe(201);
        expect(res.body._id).toBeDefined();
    });

    it("should get user plans", async () => {
        const res = await request(app)
            .get("/plan/getplan")
            .set("Cookie", cookie);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("should delete plan", async () => {
        const create = await request(app)
            .post("/plan/saveplan")
            .set("Cookie", cookie)
            .send({
                plan: {
                    submittedInformation: { subject: "DSA" },
                    plan: {
                        week1: { topicsCovered: ["Arrays"] },
                    },
                },
            });

        const res = await request(app)
            .delete(`/plan/deleteplan/${create.body._id}`)
            .set("Cookie", cookie);

        expect(res.statusCode).toBe(200);
    });
});
