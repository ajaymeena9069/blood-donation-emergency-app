import Admin from "../models/adminModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import Request from "../models/requestModel.js";

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required!" })
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            res.status(404).json({ success: false, message: "Admin not found!" })
        }

        const isMatch = await argon2.verify(admin.password, password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        const token = jwt.sign(
            { id: admin._id, name: admin.name, email: admin.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Admin login successful!",
            role: "admin",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
            
        });

    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({ success: false, message: "server error!", error: error.message })
    }
}

export const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find().populate("patient", "name city bloodGroup");
        res.status(200).json({ success: true, data: requests })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
}

export const updateRequestStatus = async (req, res) => {
    try {
        const id = req.params;
        const status = req.body;

        const updateRequest = await Request.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Request status updated!",
            data: updateRequest
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
}