import Request from "../models/requestModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import {
    emailDonorForNewRequest,
    emailDonorForPatientCancellation,
    emailPatientForAcceptance,
    emailPatientForCancellation,
} from "../utils/emailService.js";
import { createNotification } from "../utils/createNotification.js";
import Notification from "../models/notificationModel.js";

/* --------------------------
   CREATE BLOOD REQUEST
--------------------------- */
export const createRequest = async (req, res) => {
    try {
        const { bloodGroup, units, city, hospitalName, emergency } = req.body;
        const patientId = req.user.id;

        const patient = await User.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const existingRequest = await Request.findOne({
            patientId,
            status: { $in: ["pending", "accepted"] }
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending or accepted request. Complete or cancel it first."
            });
        }

        const matchingDonors = await User.find({
            _id: { $ne: patientId },
            role: "donor",
            bloodGroup,
            city: { $regex: new RegExp(`^${city}$`, "i") },
        }).select("_id name email");

        const donorResponses = matchingDonors.map((donor) => ({
            donorId: donor._id,
            status: "pending",
        }));

        const newRequest = await Request.create({
            patientId,
            patientName: patient.name,
            bloodGroup,
            units,
            city,
            hospitalName,
            emergency: emergency || false,
            donorResponses,
        });

        for (const donor of matchingDonors) {
            await createNotification({
                user: donor._id,
                forRole: "donor",
                title: emergency ? "Emergency Blood Request" : "New Blood Request",
                message: `${patient.name} needs ${bloodGroup} blood in ${city}`,
                type: "REQUEST_CREATED",
                requestId: newRequest._id,
            });

            try {
                await emailDonorForNewRequest(
                    donor.email,
                    donor.name,
                    patient.name,
                    { bloodGroup, units, city, hospitalName, emergency }
                );
            } catch (emailError) {
                console.error(
                    `Email failed for ${donor.email}:`,
                    emailError.message
                );
            }
        }

        res.status(201).json({
            success: true,
            message: "Request created successfully",
            data: newRequest,
        });
    } catch (error) {
        console.error("Create request error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


/* --------------------------
   ACCEPT REQUEST
--------------------------- */
export const acceptRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const donorId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid request ID" });
        }

        const donor = await User.findById(donorId);
        const request = await Request.findById(id);

        if (!donor) {
            return res.status(404).json({ success: false, message: "Donor not found" });
        }

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        // Check if donor is trying to accept their own request
        if (request.patientId.toString() === donorId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot accept your own blood request"
            });
        }

        if (!donor.available && donor.nextEligibleDate) {
            const now = new Date();
            const nextEligible = new Date(donor.nextEligibleDate);
            
            if (now >= nextEligible) {
                donor.available = true;
                donor.nextEligibleDate = null;
                donor.status = "active";
                await donor.save();
            } else {
                return res.status(400).json({
                    success: false,
                    message: `You are not eligible to donate until ${nextEligible.toLocaleDateString()}. Please wait for the eligibility period to complete.`
                });
            }
        }

        const existingAcceptedRequest = await Request.findOne({
            status: "accepted",
            acceptedBy: donorId
        });

        if (existingAcceptedRequest) {
            return res.status(400).json({
                success: false,
                message: "You've already accepted a blood request. Finish or cancel it first."
            });
        }

        if (
            request.status === "accepted" &&
            request.acceptedBy?.toString() !== donorId
        ) {
            return res.status(400).json({
                success: false,
                message: "This request has already been accepted",
            });
        }

        const response = request.donorResponses.find(
            r => r.donorId.toString() === donorId
        );

        if (response) {
            response.status = "accepted";
            response.respondedAt = new Date();
        } else {
            request.donorResponses.push({
                donorId,
                status: "accepted",
                respondedAt: new Date(),
            });
        }

        request.status = "accepted";
        request.acceptedBy = donorId;
        request.acceptedAt = new Date();

        await request.save();

        await createNotification({
            user: request.patientId,
            forRole: "patient",
            type: "REQUEST_ACCEPTED",
            title: "Request Accepted!",
            message: `${donor.name} has accepted your ${request.bloodGroup} blood request`,
            requestId: request._id,
        });

        await createNotification({
            user: donorId,
            forRole: "donor",
            type: "REQUEST_ACCEPTED_BY_YOU",
            title: "Request Accepted Successfully",
            message: `You have accepted ${request.patientName}'s ${request.bloodGroup} blood request at ${request.hospitalName}`,
            requestId: request._id,
        });

        try {
            const patient = await User.findById(request.patientId);
            if (patient) {
                await emailPatientForAcceptance(
                    patient.email,
                    patient.name,
                    donor.name,
                    {
                        bloodGroup: request.bloodGroup,
                        hospitalName: request.hospitalName,
                        units: request.units
                    }
                );
            }
        } catch (emailError) {
            console.error(`Email failed:`, emailError.message);
        }

        res.json({
            success: true,
            message: "Request accepted successfully",
            data: request,
        });

    } catch (err) {
        console.error("Accept request error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


/* --------------------------
   CANCEL ACCEPTANCE
--------------------------- */
export const cancelRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID",
            });
        }

        if (!reason || reason.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Cancellation reason is required (minimum 10 characters)",
            });
        }

        const request = await Request.findById(id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found",
            });
        }

        if (request.acceptedBy.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to cancel this acceptance",
            });
        }

        if (request.status !== "accepted") {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel a request that is not in accepted status",
            });
        }

        const donorResponseIndex = request.donorResponses.findIndex(
            (r) => r.donorId.toString() === userId.toString()
        );

        if (donorResponseIndex > -1) {
            request.donorResponses[donorResponseIndex].status = "cancelled";
            request.donorResponses[donorResponseIndex].cancellationReason = reason;
        }

        request.cancellationHistory.push({
            cancelledBy: userId,
            reason: reason,
            cancelledAt: new Date(),
        });

        request.status = "pending";
        request.acceptedBy = null;
        request.acceptedAt = null;

        await request.save();

        await createNotification({
            user: request.patientId,
            forRole: "patient",
            type: "REQUEST_CANCELLED",
            title: "Acceptance Cancelled",
            message: `A donor has cancelled their acceptance for your ${request.bloodGroup} request. Reason: ${reason}`,
            requestId: request._id,
            reason: reason
        });

        await createNotification({
            user: userId,
            forRole: "donor",
            type: "CANCELLATION_CONFIRMED",
            title: "Cancellation Confirmed",
            message: `You have cancelled your acceptance for ${request.patientName}'s ${request.bloodGroup} blood request`,
            requestId: request._id,
        });

        try {
            const patient = await User.findById(request.patientId);
            if (patient) {
                const donor = await User.findById(userId);
                await emailPatientForCancellation(
                    patient.email,
                    patient.name,
                    donor.name,
                    {
                        bloodGroup: request.bloodGroup,
                        hospitalName: request.hospitalName,
                        units: request.units
                    },
                    reason
                );
            }
        } catch (emailError) {
            console.error(`Email failed:`, emailError.message);
        }

        res.json({
            success: true,
            message: "Acceptance cancelled successfully",
            data: request,
        });
    } catch (err) {
        console.error("Cancel request error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/* --------------------------
   GET MATCHED REQUESTS FOR DONOR
--------------------------- */
export const getMatchedRequests = async (req, res) => {
    try {
        const donorId = req.user.id;
        const user = await User.findById(donorId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const requests = await Request.find({
            patientId: { $ne: donorId }, // Exclude own requests
            bloodGroup: user.bloodGroup,
            status: { $in: ["pending", "accepted", "completed"] }
        })
            .populate("patientId", "name email phone")
            .populate("acceptedBy", "name phone")
            .sort({ emergency: -1, createdAt: -1 });

        const filteredRequests = requests.filter(req => {
            if (req.status === "pending") return true;

            if (req.status === "accepted") {
                return req.acceptedBy && req.acceptedBy._id.toString() === donorId.toString();
            }

            if (req.status === "completed") {
                return req.acceptedBy && req.acceptedBy._id.toString() === donorId.toString();
            }

            return false;
        });

        res.json({
            success: true,
            count: filteredRequests.length,
            data: filteredRequests,
        });
    } catch (err) {
        console.error("Get matched requests error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/* --------------------------
   GET PATIENT REQUESTS
--------------------------- */
export const getPatientRequests = async (req, res) => {
    try {
        const patientId = req.user.id;

        const requests = await Request.find({ patientId })
            .populate("acceptedBy", "name email phone")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests,
        });
    } catch (error) {
        console.error("getPatientRequests Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/* --------------------------
   GET SINGLE REQUEST
--------------------------- */
export const getSingleRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid request id" });
        }

        const request = await Request.findById(id)
            .populate("patientId", "name email phone")
            .populate("acceptedBy", "name email phone");

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        const isPatient = request.patientId._id.toString() === userId;
        const isMatchedDonor = request.donorResponses.some(
            (d) => d.donorId.toString() === userId
        );
        const isAdmin = req.user.role && req.user.role.includes("admin");
        const isEligibleDonor = req.user.role && req.user.role.includes("donor") && req.user.bloodGroup === request.bloodGroup;

        if (!isPatient && !isMatchedDonor && !isAdmin && !isEligibleDonor) {
            return res.status(403).json({ success: false, message: "Not authorized to view this request" });
        }

        res.status(200).json({ success: true, data: request });
    } catch (error) {
        console.error("getSingleRequest Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteRequest = async (req, res) => {
    const { id } = req.params;

    try {
        const bloodRequest = await Request.findById(id);

        if (!bloodRequest) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        if (bloodRequest.patientId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this request" });
        }

        if (bloodRequest.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Completed requests cannot be deleted."
            });
        }

        if (bloodRequest.status === "accepted" && bloodRequest.acceptedBy) {
            const donor = await User.findById(bloodRequest.acceptedBy);
            if (donor) {
                try {
                    await emailDonorForPatientCancellation(
                        donor.email,
                        donor.name,
                        req.user.name,
                        {
                            bloodGroup: bloodRequest.bloodGroup,
                            hospitalName: bloodRequest.hospitalName,
                            city: bloodRequest.city,
                            units: bloodRequest.units
                        }
                    );
                } catch (emailError) {
                    console.error(`Email failed for ${donor.email}:`, emailError.message);
                }

                await createNotification({
                    user: donor._id,
                    forRole: "donor",
                    title: "Request Cancelled by Patient",
                    message: `${req.user.name} has cancelled the ${bloodRequest.bloodGroup} blood request you accepted`,
                    type: "REQUEST_CANCELLED_BY_PATIENT",
                    requestId: bloodRequest._id,
                });
            }
        }

        await Request.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: bloodRequest.status === "accepted"
                ? "Request cancelled successfully. Donor has been notified."
                : "Request deleted successfully"
        });

    } catch (error) {
        console.error("deleteRequest Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const updateRequest = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const bloodRequest = await Request.findById(id);
        if (!bloodRequest) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        if (bloodRequest.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Cannot update an accepted or completed request."
            });
        }

        const updatedData = await Request.findByIdAndUpdate(id, { $set: updates }, { new: true });

        res.status(200).json({ success: true, data: updatedData });
    } catch (error) {
        console.error("updateRequest Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

/* --------------------------
   COMPLETE REQUEST
--------------------------- */
export const completeRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid request ID" });
        }

        const request = await Request.findById(id);

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        if (request.patientId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Only patient can complete the request" });
        }

        if (request.status !== "accepted") {
            return res.status(400).json({ success: false, message: "Only accepted requests can be completed" });
        }

        request.status = "completed";
        request.completedAt = new Date();
        await request.save();

        if (request.acceptedBy) {
            const donor = await User.findById(request.acceptedBy);
            if (donor) {
                const now = new Date();
                const nextEligible = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

                donor.available = false;
                donor.lastDonationDate = now;
                donor.nextEligibleDate = nextEligible;
                donor.totalDonations = (donor.totalDonations || 0) + 1;
                donor.status = "inactive";
                await donor.save();
                
                console.log('Donor updated:', {
                    id: donor._id,
                    available: donor.available,
                    nextEligibleDate: donor.nextEligibleDate,
                    totalDonations: donor.totalDonations
                });

                await createNotification({
                    user: request.acceptedBy,
                    forRole: "donor",
                    type: "REQUEST_COMPLETED",
                    title: "Donation Completed!",
                    message: `Thank you! ${request.patientName}'s ${request.bloodGroup} blood request completed. You'll be available again on ${nextEligible.toLocaleDateString()}`,
                    requestId: request._id,
                });
            }
        }

        await createNotification({
            user: request.patientId,
            forRole: "patient",
            type: "REQUEST_COMPLETED",
            title: "Request Completed",
            message: `Your ${request.bloodGroup} blood request has been marked as completed`,
            requestId: request._id,
        });

        res.json({
            success: true,
            message: "Request completed successfully. Donor deactivated for 90 days.",
            data: request,
        });
    } catch (error) {
        console.error("Complete request error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
