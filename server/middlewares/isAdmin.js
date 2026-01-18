import User from "../models/userModel.js";

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access Denied: You are not an Admin!"
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: "Auth Error" });
    }
}