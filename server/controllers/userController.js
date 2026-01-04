import User from "../models/userModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, bloodGroup, city, age, gender, roleType } = req.body;

        if (!name || !email || !password || !phone || !bloodGroup || !city || !age || !gender || !roleType) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }

        const hashPassword = await argon2.hash(password);
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            phone,
            bloodGroup,
            city,
            age,
            gender,
            role: [roleType]
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials!" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successfully!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                bloodGroup: user.bloodGroup,
                city: user.city,
                age: user.age,
                gender: user.gender,
                available: user.available,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
}

export const activateRole = async (req, res) => {
    try {
        const { userId, roleToActivate } = req.body;
        const allowedRoles = ["donor", "patient"];

        if (!allowedRoles.includes(roleToActivate)) {
            return res.status(400).json({ success: false, message: "Invalid role type" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Checking if user have already this role...

        if (user.role.includes(roleToActivate)) {
            return res.status(400).json({
                success: false,
                message: `You are already a ${roleToActivate}`
            });
        }

        user.role.push(roleToActivate);

        if (roleToActivate === "donor") {
            user.available = true;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: `${roleToActivate} mode activated successfully!`,
            roles: user.role
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}