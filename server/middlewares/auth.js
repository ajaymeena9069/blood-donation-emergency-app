import jwt from "jsonwebtoken";
import User from "../models/userModel.js";  // ADD THIS
import { JWT_SECRET } from "../config/env.js";

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied! No token provided."
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });
        }

        if (user.status === "blocked") {
            return res.status(403).json({
                success: false,
                message: "Your account has been blocked by admin. Please contact support."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Token verification error:", error);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token!"
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired! Please login again."
            });
        }

        res.status(500).json({
            success: false,
            message: "Authentication failed"
        });
    }
}