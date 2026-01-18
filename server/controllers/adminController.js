import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import Request from "../models/requestModel.js";
import User from "../models/userModel.js"

export const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find().populate("patient", "name city bloodGroup").populate("acceptedBy", "name phoneNumber")
            .sort({ createdAt: -1 });
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

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        })
    } catch (error) {
        console.log("getAllUsers", error);
        res.status(500).json({
            success: false,
            message: "Server error! Could not fetch users.",
            error: error.message
        })
    }
}