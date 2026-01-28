const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoutes");
const trackplanRoutes = require("./routes/trackplanRoute");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./db/connectDB");


dotenv.config();
const app = express();

// Middleware
const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl)
        if (!origin) return callback(null, true);

        const allowed = [
            "http://localhost:3000",
            "http://localhost:5173",
        ];

        if (allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
// MongoDB Connection
connectDB();
// Routes
app.use("/auth", authRoutes);
app.use("/plan", planRoutes);
app.use("/track", trackplanRoutes);

// Error Handling Middleware
app.use(errorHandler);

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));