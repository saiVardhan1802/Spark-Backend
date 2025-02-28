const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
        res.json({ token, _id, message: "Login successful" }).status(200);
    }
    catch (err) {
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
        const { userName, password } = req.body;
        const user = await userModel.findOne({ userName });
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
        next(err);
    }
});

module.exports = { authRoutes: router };