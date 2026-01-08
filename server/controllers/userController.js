import User from "../models/userModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, bloodGroup, city, age, gender, roleType } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
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
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                bloodGroup: newUser.bloodGroup,
                city: newUser.city,
                age: newUser.age,
                gender: newUser.gender,
                role: newUser.role,
                available: newUser.available
            }
        });
    } catch (error) {
        console.error("Register error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error!",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials!"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful!",
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
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error!",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const activateRole = async (req, res) => {
    try {
        const { roleToActivate } = req.body;
        const userId = req.user.id; 

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

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
            message: `${roleToActivate} role activated successfully!`,
            roles: user.role
        });
    } catch (error) {
        console.error("Activate role error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if ('available' in updateData) {
            const user = await User.findById(req.user.id); // FIXED: Added await

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            if (!user.role.includes("donor")) {
                delete updateData.available;
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Update profile error:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};