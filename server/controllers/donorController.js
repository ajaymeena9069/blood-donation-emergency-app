import User from "../models/userModel.js";
// GET ALL DONORS

export const getAllDonors = async (req, res) => {
    try {
        const donors = await User.find({ role: "donor" });
        res.status(200).json({
            success: true,
            message: "Donors fetched successfully!",
            data: donors
        });

    } catch (error) {
        console.error("Fetch Donors Error:", error);
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
}
