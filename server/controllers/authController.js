const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Joi = require("joi");

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const register = async (req, res) => {
    const { name, email, password, organization, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({ name, email, password: hashedPassword, organization, role });
        res.status(201).json({ message: "User registered", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        const cookiesOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
        res.cookie('token', token, cookiesOption)

        return res.json({
            message: "Login successfully",
            error: false,
            success: true,
            data: {
                token,
            }
        })
    } else {
        res.status(400).json({ error: "Invalid credentials" });
    }
};


const userInf = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(400).json({ error: 'User not authenticated' });
        }
        // console.log("request received for user info");
        const user = await User.findById(req.userId).select('-password');
        // console.log(user);
        res.status(200).json({ user });
    } catch (error) {
        console.log("error in userinfcontroller");
        res.status(500).json({ error: error.message });
    }
}

const logout = async (req, res) => {
    res.clearCookie('token')
    return res.json({
        message: "Logout successfully",
        error: false,
        success: true,
    })
}

const edituser = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(400).json({ error: 'User not authenticated' });
        }
        const { name, organization } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { name, organization },
            { new: true }
        ).select('-password');
        res.status(200).json({ user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { register, login, logout, userInf, edituser, registerSchema, loginSchema };