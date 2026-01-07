const express = require("express");
const { register, login, logout, userInf, edituser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/userinfo", authMiddleware, userInf);
router.put("/edituser", authMiddleware, edituser);

module.exports = router;