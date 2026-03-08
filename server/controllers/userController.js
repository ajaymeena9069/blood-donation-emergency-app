import User from "../models/userModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/emailService.js";

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, bloodGroup, city, age, gender, roleType, available } = req.body;

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
            role: [roleType],
            activeRole: roleType,
            available: roleType === 'donor' ? (available !== undefined ? available : true) : false
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

        if (user.status === "blocked") {
            return res.status(403).json({
                success: false,
                message: "Your account has been blocked by admin. Please contact support.",
                blocked: true
            });
        }

        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials!"
            });
        }

        if (!user.activeRole) {
            user.activeRole = user.role.includes('admin') ? 'admin' : user.role[0];
            await user.save();
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
                role: user.role,
                activeRole: user.activeRole
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

// controllers/userController.js

export const activateRole = async (req, res) => {
  try {
    const { roleToActivate } = req.body;
    const userId = req.user.id;

    const validRoles = ["donor", "patient", "admin"];
    if (!validRoles.includes(roleToActivate)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Add role if not present
    if (!user.role.includes(roleToActivate)) {
      user.role.push(roleToActivate);
    }

    // Always set activeRole
    user.activeRole = roleToActivate;

    // Donor specific
    if (roleToActivate === "donor") user.available = true;

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, activeRole: user.activeRole },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: `${roleToActivate} role activated!`,
      data: { roles: user.role, token, user },
    });
  } catch (error) {
    console.error("Activate role error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
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
            data: user
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
            const user = await User.findById(req.user.id);

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

export const resetDonorTimer = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.role.includes("donor")) {
            return res.status(400).json({ success: false, message: "Only donors can reset timer" });
        }

        user.available = true;
        user.nextEligibleDate = null;
        user.status = "active";
        await user.save();

        res.json({
            success: true,
            message: "Timer reset successfully",
            user: { available: user.available, nextEligibleDate: user.nextEligibleDate }
        });
    } catch (error) {
        console.error("Reset timer error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email"
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
        await user.save();

        // Send email
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
        
        try {
            await sendPasswordResetEmail(user.email, user.name, resetUrl);
            res.json({
                success: true,
                message: "Password reset link sent to your email"
            });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            
            return res.status(500).json({
                success: false,
                message: "Failed to send email. Please try again."
            });
        }
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        // Update password
        user.password = await argon2.hash(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({
            success: true,
            message: "Password reset successful! You can now login."
        });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};