const request = require("supertest");
const app = require("../app");

describe("Auth API", () => {
    it("should register user", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "test@test.com",
                password: "123456",
                organization: "TestOrg",
                role: "student",
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.email).toBe("test@test.com");
    });

    it("should login user and set cookie", async () => {
        await request(app).post("/auth/register").send({
            name: "Login User",
            email: "login@test.com",
            password: "123456",
            organization: "TestOrg",
            role: "student",
        });

        const res = await request(app)
            .post("/auth/login")
            .send({
                email: "login@test.com",
                password: "123456",
            });

        expect(res.statusCode).toBe(200);

        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toMatch(/token=/);
    });

    it("should logout and remove cookie", async () => {
        await request(app).post("/auth/register").send({
            name: "Login User",
            email: "login@test.com",
            password: "123456",
            organization: "TestOrg",
            role: "student",
        });

        const loginRes = await request(app)
            .post("/auth/login")
            .send({
                email: "login@test.com",
                password: "123456",
            });

        const cookie = loginRes.headers["set-cookie"];
        expect(cookie).toBeDefined();

        const logoutRes = await request(app)
            .post("/auth/logout")
            .set("Cookie", cookie)
            .send();

        expect(logoutRes.statusCode).toBe(200);

        const logoutCookie = logoutRes.headers["set-cookie"];
        expect(logoutCookie[0]).toMatch(/token=;/);
    });

});


describe("User API", () => {
    let cookie;

    beforeEach(async () => {
        await request(app).post("/auth/register").send({
            name: "Test User",
            email: "user@test.com",
            password: "123456",
            organization: "TestOrg",
            role: "student",
        });

        const loginRes = await request(app)
            .post("/auth/login")
            .send({
                email: "user@test.com",
                password: "123456",
            });

        cookie = loginRes.headers["set-cookie"];
        expect(cookie).toBeDefined();
    });

    it("should return authenticated user info", async () => {
        const res = await request(app)
            .get("/auth/userinfo")
            .set("Cookie", cookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.email).toBe("user@test.com");
        expect(res.body.user.password).toBeUndefined();
    });
    it("should update user profile", async () => {
        const res = await request(app)
            .put("/auth/edituser")
            .set("Cookie", cookie)
            .send({
                name: "Updated Name",
                organization: "NewOrg",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.user.name).toBe("Updated Name");
        expect(res.body.user.organization).toBe("NewOrg");
        expect(res.body.user.password).toBeUndefined();
    });
});
