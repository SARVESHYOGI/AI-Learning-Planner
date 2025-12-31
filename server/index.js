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
app.use(cors(
    {
        origin: "https://ai-powered-sql-prep.vercel.app",
        // origin: "http://localhost:5173",
        // origin: "*",
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));
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