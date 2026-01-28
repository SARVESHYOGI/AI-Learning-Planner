const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://ailearningplan.vercel.app",
    "https://ai-learning-planner.vercel.app",
];

module.exports = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
