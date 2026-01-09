import Request from "../models/requestModel.js";
import User from "../models/userModel.js";

// ------------------------------------------------------
// 🔹 Create Blood Request  (Patient)
// ------------------------------------------------------
export const createRequest = async (req, res) => {
    try {
        const { patientId, bloodGroup, units, city, hospitalName, emergency } = req.body;

        const newRequest = await Request.create({
            patientId,
            bloodGroup,
            units,
            city,
            hospitalName,
            emergency,
            donorResponses: [],
            acceptedBy: null,
            status: "pending",
        });

        res.status(201).json({
            success: true,
            data: newRequest,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ------------------------------------------------------
// 🔹 Get All Requests of Patient
// ------------------------------------------------------
export const getPatientRequests = async (req, res) => {
    try {
        const { patientId } = req.params;

        const requests = await Request.find({ patientId })
            .populate("acceptedBy", "name email");

        return res.status(200).json({
            success: true,
            data: requests,
        });

    } catch (error) {
        console.error("getPatientRequests Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// ------------------------------------------------------
// 🔹 Get Donor Matches
// ------------------------------------------------------
export const getDonorMatches = async (req, res) => {
    try {
        const donorId = req.params.donorId;
        // correct Request model use
        const matches = await Request.find({ "donorResponses.donorId": donorId });
        res.status(200).json({ success: true, data: matches });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ------------------------------------------------------
// 🔹 Match Requests for Donor (Auto-Matching)
// ------------------------------------------------------
export const getMatchedRequests = async (req, res) => {
    try {
        const donorId = req.user.id;

        const donor = await User.findById(donorId);
        if (!donor) {
            return res.status(404).json({
                success: false,
                message: "Donor not found",
            });
        }

        const donorCity = donor.city.trim().toLowerCase();
        const donorBlood = donor.bloodGroup;
        const requests = await Request.find({
            $and: [
                {
                    $or: [
                        {
                            status: "pending",
                            bloodGroup: donorBlood,
                            city: { $regex: new RegExp("^" + donorCity + "$", "i") },
                        },
                        { acceptedBy: donorId }
                    ]
                },
                {
                    patientId: { $ne: donorId }
                }
            ]
        })
            .populate("patientId", "name email phone")
            .sort({ createdAt: -1 }); // Sort by newest first

        return res.status(200).json({
            success: true,
            data: requests,
        });

    } catch (error) {
        console.error("getMatchedRequests Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// ------------------------------------------------------
// 🔹 Donor: Accept / Reject Request
// ------------------------------------------------------
export const handleDonorResponse = async (req, res) => {
    try {
        const donorId = req.user.id;
        const { requestId } = req.params;
        const { action } = req.body;

        // Only allow accepted or cancel
        if (!["accepted", "cancel"].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Invalid action",
            });
        }

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found",
            });
        }

        // Already accepted by another donor
        if (
            request.status === "accepted" &&
            request.acceptedBy &&
            request.acceptedBy.toString() !== donorId
        ) {
            return res.status(400).json({
                success: false,
                message: "This request is already accepted by another donor",
            });
        }

        // Find existing donor response
        let existing = request.donorResponses.find(
            (resp) => resp.donorId.toString() === donorId
        );

        if (!existing) {
            existing = { donorId, status: action, timestamp: new Date() };
            request.donorResponses.push(existing);
        } else {
            existing.status = action;
            existing.timestamp = new Date();
        }

        // ACCEPT → lock request
        if (action === "accepted") {
            request.acceptedBy = donorId;
            request.status = "accepted";
        }

        // CANCEL → unlock request
        if (action === "cancel") {
            if (request.acceptedBy?.toString() !== donorId) {
                return res.status(400).json({
                    success: false,
                    message: "You cannot cancel this request",
                });
            }
            request.acceptedBy = null;
            request.status = "pending";
        }

        await request.save();

        return res.status(200).json({
            success: true,
            message: `Request ${action} successfully`,
            data: request,
        });

    } catch (error) {
        console.error("handleDonorResponse Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// ------------------------------------------------------
// 🔹 Get Single Request (fix RequestModel -> Request)
// ------------------------------------------------------
export const getSingleRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await Request.findById(id)
            .populate("patientId", "name email phone")
            .populate("acceptedBy", "name email");
        if (!request)
            return res.status(404).json({ success: false, message: "Request not found" });
        res.json({ success: true, data: request });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
