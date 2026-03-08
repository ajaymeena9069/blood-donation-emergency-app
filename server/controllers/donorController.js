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

// RESET DONATION TIMER (Development Only)
export const resetDonationTimer = async (req, res) => {
    try {
        const userId = req.user.id;
        const donor = await User.findById(userId);

        if (!donor) {
            return res.status(404).json({ success: false, message: "Donor not found" });
        }

        if (!donor.role.includes("donor")) {
            return res.status(403).json({ success: false, message: "Only donors can reset timer" });
        }

        donor.available = true;
        donor.lastDonationDate = null;
        donor.nextEligibleDate = null;
        await donor.save();

        res.json({
            success: true,
            message: "Donation timer reset successfully. You are now available for donations.",
            data: donor
        });
    } catch (error) {
        console.error("Reset timer error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
