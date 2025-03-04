const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth")

router.post("/register", async (req, res, next) => {
    try {
        const { firstName, lastName, userName, email, password } = req.body;
        console.log(req.body);
        console.log(firstName, email, password);
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new userModel({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
        });
        await user.save();
        res.json({ message: "User registered successfully" }).status(200);
        const payload = {
            id: user._id,
            name: user.firstName,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY);
        res.json({ token, _id: user._id, message: "Login successful" }).status(200);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});

router.put("/register", async (req, res, next) => {
    const { _id } = req.body;
    const user = await userModel.findOneAndUpdate({ _id });
    if (!user) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }
    res.json(user).status(200);
})

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        const payload = {
            id: user._id,
            name: user.name,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY);
        res.json({ token, message: "Login successful" }).status(200);
    }
    catch (err) {
        console.log(err)
        next(err);
    }
});

router.get("/user", authMiddleware, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/user", authMiddleware, async (req, res) => {
    try {
        const updates = req.body;
        const allowedUpdates = [
            "profileTitle", "profileImg", "bio", "links", "shops", 
            "layout", "fill", "shadow", "outline", "buttonColor", "buttonFontColor", "font", "fontColor", "Theme"
        ];

        const updateFields = Object.keys(updates);
        const isValidOperation = updateFields.every(field => allowedUpdates.includes(field));
        if (!isValidOperation) return res.status(400).json({ message: "Invalid update fields" });

        const user = await userModel.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;