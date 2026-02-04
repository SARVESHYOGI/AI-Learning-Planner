const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const rateLimiter = require("../middleware/rateLimiter");

let mongo;

beforeAll(async () => {
    process.env.JWT_SECRET = "testsecret";
    process.env.NODE_ENV = "test";

    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
    rateLimiter._clear();
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
});
