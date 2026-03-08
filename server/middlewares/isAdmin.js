import User from "../models/userModel.js";

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Check if user has admin role (role can be array or string)
        const hasAdminRole = Array.isArray(user.role) 
            ? user.role.includes("admin") 
            : user.role === "admin";
            
        if (!hasAdminRole) {
            return res.status(403).json({
                success: false,
                message: "Access Denied: You are not an Admin!"
            });
        }

        next();
    } catch (error) {
        console.error("isAdmin middleware error:", error);
        res.status(500).json({ success: false, message: "Auth Error" });
    }
}