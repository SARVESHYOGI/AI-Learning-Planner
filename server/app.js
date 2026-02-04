const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoutes");
const trackplanRoutes = require("./routes/trackplanRoute");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/cors");

const app = express();

app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/plan", planRoutes);
app.use("/track", trackplanRoutes);

app.use(errorHandler);

module.exports = app;
