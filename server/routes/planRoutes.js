const express = require("express");
const { generatePlan, savePlan, getPlan, deleteplan, generateQuestion } = require("../controllers/planController");
const authMiddleware = require("../middleware/authMiddleware");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/generate-plan", authMiddleware, rateLimiter({ max: 3, windowMs: 60_000 }), generatePlan);
router.post("/generatequestion", authMiddleware, rateLimiter({ max: 3, windowMs: 60_000 }), generateQuestion);

router.post("/saveplan", authMiddleware, savePlan);
router.get("/getplan", authMiddleware, getPlan);
router.delete("/deleteplan/:id", authMiddleware, deleteplan);

module.exports = router;