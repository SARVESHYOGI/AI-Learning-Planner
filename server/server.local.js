const dotenv = require("dotenv");
const connectDB = require("./db/connectDB");
const app = require("./app");
require("./emails/streakMissedReminder.js");

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
    await connectDB();
    app.listen(PORT, () =>
        console.log(`🚀 Server running on port ${PORT}`)
    );
}

start();
