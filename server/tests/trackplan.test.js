const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

let cookie;
let planId;

beforeAll(async () => {
    await mongoose.connection.db.dropDatabase();

    await request(app).post("/auth/register").send({
        name: "Track User",
        email: "track@test.com",
        password: "123456",
        organization: "TestOrg",
        role: "student",
    });

    const loginRes = await request(app).post("/auth/login").send({
        email: "track@test.com",
        password: "123456",
    });

    cookie = loginRes.headers["set-cookie"];

    const planRes = await request(app)
        .post("/plan/saveplan")
        .set("Cookie", cookie)
        .send({
            plan: {
                submittedInformation: { subject: "DSA" },
                plan: {
                    week1: {
                        weekNumber: 1,
                        topicsCovered: ["Arrays"],
                        exercises: ["Solve"],
                        isCompleted: false
                    }
                }
            }
        });

    planId = planRes.body._id;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Track Plan API", () => {

    it("should add plan to track", async () => {
        const res = await request(app)
            .post(`/track/trackplan/${planId}`)
            .set("Cookie", cookie);

        expect(res.statusCode).toBe(200);
    });

    it("should block unauthorized user", async () => {
        const res = await request(app).get("/track/trackplan");
        expect(res.statusCode).toBe(401);
    });

});
