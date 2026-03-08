import User from "../models/userModel.js";
import BloodRequest from "../models/requestModel.js";

export const getHomeStats = async (req, res) => {
    try {
        const donors = await User.find({ role: "donor" });
        const totalDonors = donors.length;
        const availableDonors = donors.filter(d => d.available).length;
        
        const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
        const bloodGroupStats = bloodGroups.map(group => ({
            group,
            count: donors.filter(d => d.bloodGroup === group && d.available).length
        }));

        const cityStats = {};
        donors.forEach(d => {
            if (d.city) {
                cityStats[d.city] = (cityStats[d.city] || 0) + 1;
            }
        });
        const topCities = Object.entries(cityStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([city, count]) => ({ city, count }));

        const completedRequests = await BloodRequest.countDocuments({ status: "completed" });
        const totalRequests = await BloodRequest.countDocuments();

        res.json({
            success: true,
            data: {
                totalDonors,
                availableDonors,
                bloodGroupStats,
                topCities,
                livesSaved: completedRequests * 3,
                totalRequests,
                completedRequests
            }
        });
    } catch (error) {
        console.error("Get home stats error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
