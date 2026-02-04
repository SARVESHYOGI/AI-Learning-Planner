const express = require("express");
const { generatePlan, savePlan, getPlan, deleteplan, generateQuestion } = require("../controllers/planController");
const authMiddleware = require("../middleware/authMiddleware");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/generate-plan", authMiddleware, rateLimiter({ capacity: 3, refillRatePerSec: 3 / 60 }), generatePlan);
router.post("/generatequestion", authMiddleware, rateLimiter({ capacity: 3, refillRatePerSec: 3 / 60 }), generateQuestion);

router.post("/saveplan", authMiddleware, savePlan);
router.get("/getplan", authMiddleware, getPlan);
router.delete("/deleteplan/:id", authMiddleware, deleteplan);

module.exports = router;