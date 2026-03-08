import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import Request from "../models/requestModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import mongoose from "mongoose";
import { sendNewUserCredentials } from "../utils/emailService.js";

// GET DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalDonors,
            totalPatients,
            availableDonors,
            totalRequests,
            pendingRequests,
            acceptedRequests,
            completedRequests,
            emergencyRequests,
            bloodGroupStats,
            cityStats
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "donor" }),
            User.countDocuments({ role: "patient" }),
            User.countDocuments({ role: "donor", available: true }),
            Request.countDocuments(),
            Request.countDocuments({ status: "pending" }),
            Request.countDocuments({ status: "accepted" }),
            Request.countDocuments({ status: "completed" }),
            Request.countDocuments({ emergency: true, status: { $ne: "completed" } }),
            User.aggregate([
                { $group: { _id: "$bloodGroup", count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            User.aggregate([
                {
                    $group: {
                        _id: "$city",
                        donors: { $sum: { $cond: [{ $in: ["donor", "$role"] }, 1, 0] } },
                        patients: { $sum: { $cond: [{ $in: ["patient", "$role"] }, 1, 0] } }
                    }
                },
                { $sort: { donors: -1 } },
                { $limit: 10 }
            ])
        ]);

        res.status(200).json({
            success: true,
            data: {
                users: { total: totalUsers, donors: totalDonors, patients: totalPatients, availableDonors },
                requests: { total: totalRequests, pending: pendingRequests, accepted: acceptedRequests, completed: completedRequests, emergency: emergencyRequests },
                bloodGroupStats,
                cityStats
            }
        });
    } catch (error) {
        console.error("getDashboardStats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats"
        });
    }
};

// GET ALL REQUESTS
export const getAllRequests = async (req, res) => {
    try {
        const { status, emergency, page = 1, limit = 50 } = req.query;

        // Validate pagination
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));

        const filter = {};
        if (status) filter.status = status;
        if (emergency === 'true') filter.emergency = true;

        const skip = (pageNum - 1) * limitNum;

        const [requests, total] = await Promise.all([
            Request.find(filter)
                .populate("patientId", "name city bloodGroup phone")
                .populate("acceptedBy", "name phone")
                .sort({ emergency: -1, createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Request.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            data: requests,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error("getAllRequests error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch requests"
        });
    }
};

// CREATE NEW USER
export const createUser = async (req, res) => {
    try {
        const { name, email, phone, bloodGroup, city, age, gender, role } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email, phone, and role are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? "Email already exists" : "Phone already exists"
            });
        }

        // Generate default password
        const defaultPassword = `Blood@${Math.random().toString(36).slice(-8)}`;
        const hashedPassword = await argon2.hash(defaultPassword);

        // Create user
        const newUser = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            bloodGroup: bloodGroup || undefined,
            city: city || undefined,
            age: age || undefined,
            gender: gender || undefined,
            role: [role],
            activeRole: role,
            status: "active",
            available: role === "donor" ? true : false
        });

        // Remove password from response
        const userResponse = newUser.toObject();
        delete userResponse.password;

        // Send credentials email (don't wait for it)
        sendNewUserCredentials(email, name, defaultPassword, role).catch(err => {
            console.error('Failed to send credentials email:', err);
        });

        res.status(201).json({
            success: true,
            message: "User created successfully. Credentials sent to email.",
            data: {
                user: userResponse,
                defaultPassword
            }
        });
    } catch (error) {
        console.error("createUser error:", error);

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages[0]
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create user"
        });
    }
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {
        const { role, available, city, bloodGroup, page = 1, limit = 100 } = req.query;

        // Validate pagination
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 100));

        const filter = {};
        if (role) filter.role = role;
        if (available !== undefined) filter.available = available === 'true';
        if (city) filter.city = new RegExp(city, 'i');
        if (bloodGroup) filter.bloodGroup = bloodGroup;

        // Exclude current admin from results
        filter._id = { $ne: req.user._id };

        const skip = (pageNum - 1) * limitNum;

        const [users, total] = await Promise.all([
            User.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            User.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error("getAllUsers error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

// UPDATE USER
export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        const updateData = {};
        const allowedFields = ['name', 'email', 'phone', 'bloodGroup', 'city', 'age', 'gender', 'status', 'available'];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update"
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        console.error("updateUserStatus error:", error);

        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }

        // Handle validation error
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages[0]
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update user"
        });
    }
};

// DELETE USER
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user has pending/accepted requests
        const activeRequests = await Request.countDocuments({
            patientId: id,
            status: { $in: ['pending', 'accepted'] }
        });

        if (activeRequests > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete user with active requests"
            });
        }

        // Delete user and related data
        await Promise.all([
            User.findByIdAndDelete(id),
            Request.deleteMany({ patientId: id }),
            Notification.deleteMany({ user: id })
        ]);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("deleteUser error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
};

// UPDATE REQUEST STATUS
export const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID format"
            });
        }

        // Validate status
        const validStatuses = ['pending', 'accepted', 'completed', 'rejected'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        // Validate rejection reason
        if (status === 'rejected' && (!rejectionReason || rejectionReason.trim().length < 10)) {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required and must be at least 10 characters"
            });
        }

        const request = await Request.findById(id)
            .populate("patientId", "name email")
            .populate("acceptedBy", "name");

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        // Check if status is already completed/rejected
        if (request.status === 'completed' || request.status === 'rejected') {
            return res.status(400).json({
                success: false,
                message: `Cannot update ${request.status} request`
            });
        }

        request.status = status;

        // If marking as rejected
        if (status === "rejected") {
            request.rejectionReason = rejectionReason;
            request.rejectedAt = new Date();

            // Notification for patient
            if (request.patientId) {
                try {
                    await Notification.create({
                        user: request.patientId._id,
                        forRole: "patient",
                        type: "REQUEST_REJECTED",
                        title: "Request Rejected",
                        message: `Your ${request.bloodGroup} blood request has been rejected. Reason: ${rejectionReason}`,
                        requestId: request._id,
                    });
                } catch (notifError) {
                    console.error('Failed to create notification:', notifError);
                }

                // Send email notification (don't wait)
                try {
                    const { sendRequestRejectionEmail } = await import('../utils/emailService.js');
                    sendRequestRejectionEmail(
                        request.patientId.email,
                        request.patientId.name,
                        request.bloodGroup,
                        rejectionReason
                    ).catch(err => console.error('Failed to send rejection email:', err));
                } catch (emailError) {
                    console.error('Failed to import email service:', emailError);
                }
            }
        }

        // If marking as completed
        if (status === "completed") {
            request.completedAt = new Date();

            // Update donor eligibility
            if (request.acceptedBy) {
                const donor = await User.findById(request.acceptedBy._id);
                if (donor) {
                    const now = new Date();
                    const nextEligible = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

                    donor.available = false;
                    donor.lastDonationDate = now;
                    donor.nextEligibleDate = nextEligible;
                    donor.totalDonations = (donor.totalDonations || 0) + 1;
                    donor.status = "inactive";
                    await donor.save();

                    // Notification for donor
                    await Notification.create({
                        user: donor._id,
                        forRole: "donor",
                        type: "REQUEST_COMPLETED",
                        title: "Donation Completed!",
                        message: `Thank you! Your donation for ${request.patientName || 'patient'} is completed.`,
                        requestId: request._id,
                    });
                }
            }

            // Notification for patient
            if (request.patientId) {
                await Notification.create({
                    user: request.patientId._id,
                    forRole: "patient",
                    type: "REQUEST_COMPLETED",
                    title: "Request Completed",
                    message: `Your ${request.bloodGroup} blood request has been completed`,
                    requestId: request._id,
                });
            }
        }

        await request.save();

        res.status(200).json({
            success: true,
            message: "Request status updated successfully",
            data: request
        });
    } catch (error) {
        console.error("updateRequestStatus error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update request status"
        });
    }
};

// DELETE REQUEST
export const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID format"
            });
        }

        const request = await Request.findById(id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        // Don't allow deleting completed requests
        if (request.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: "Cannot delete completed requests"
            });
        }

        await Request.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Request deleted successfully"
        });
    } catch (error) {
        console.error("deleteRequest error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete request"
        });
    }
};

// GET RECENT ACTIVITIES
export const getRecentActivities = async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 20));

        const [recentRequests, recentUsers] = await Promise.all([
            Request.find()
                .populate("patientId", "name bloodGroup")
                .populate("acceptedBy", "name")
                .sort({ createdAt: -1 })
                .limit(limitNum),
            User.find()
                .select("name role available createdAt")
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        const activities = [];

        // Add request activities
        recentRequests.forEach(req => {
            const patientName = req.patientId?.name || 'Unknown';
            const bloodGroup = req.bloodGroup || 'N/A';
            const timeDiff = getTimeDifference(req.createdAt);

            let type = 'pending';
            let message = '';

            if (req.status === 'completed') {
                type = 'completed';
                message = `Blood request completed for ${patientName} (${bloodGroup})`;
            } else if (req.emergency) {
                type = 'emergency';
                message = `Emergency request for ${bloodGroup} blood by ${patientName}`;
            } else if (req.status === 'accepted') {
                type = 'success';
                const donorName = req.acceptedBy?.name || 'a donor';
                message = `${donorName} accepted request from ${patientName}`;
            } else {
                message = `New blood request from ${patientName} (${bloodGroup})`;
            }

            activities.push({
                _id: req._id,
                message,
                time: timeDiff,
                type,
                createdAt: req.createdAt
            });
        });

        // Add user activities
        recentUsers.forEach(user => {
            const timeDiff = getTimeDifference(user.createdAt);
            // role is an array, check properly
            let role = 'user';
            if (Array.isArray(user.role)) {
                if (user.role.includes('admin')) role = 'admin';
                else if (user.role.includes('donor')) role = 'donor';
                else if (user.role.includes('patient')) role = 'patient';
            }

            activities.push({
                _id: user._id,
                message: `${user.name} registered as ${role}`,
                time: timeDiff,
                type: user.available ? 'success' : 'pending',
                createdAt: user.createdAt
            });
        });

        // Sort by date and limit
        activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const limitedActivities = activities.slice(0, limitNum);

        res.status(200).json({
            success: true,
            data: limitedActivities
        });
    } catch (error) {
        console.error("getRecentActivities error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch activities"
        });
    }
};

// Helper function to calculate time difference
function getTimeDifference(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

// GET ANALYTICS DATA
export const getAnalytics = async (req, res) => {
    try {
        const { timeRange = 'week' } = req.query;

        // Validate timeRange
        const validRanges = ['week', 'month', 'quarter', 'year'];
        if (!validRanges.includes(timeRange)) {
            return res.status(400).json({
                success: false,
                message: "timeRange must be week, month, quarter, or year"
            });
        }

        let startDate = new Date();
        switch (timeRange) {
            case 'week':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case 'quarter':
                startDate.setMonth(startDate.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
        }

        // Run aggregations in parallel
        const [requestsByDay, monthlyData, usersByMonth, todayStats, bloodStock] = await Promise.all([
            Request.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        requests: { $sum: 1 },
                        emergencies: { $sum: { $cond: ["$emergency", 1, 0] } },
                        completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            Request.aggregate([
                { $match: { createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        requests: { $sum: 1 },
                        completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            User.aggregate([
                { $match: { createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        users: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            (async () => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const [todayUsers, todayRequests] = await Promise.all([
                    User.countDocuments({ createdAt: { $gte: today } }),
                    Request.countDocuments({ createdAt: { $gte: today } })
                ]);

                return { todayUsers, todayRequests };
            })(),
            User.aggregate([
                { $match: { role: 'donor', available: true } },
                { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ])
        ]);

        // Combine monthly data
        const monthlyTrend = monthlyData.map(m => {
            const userMonth = usersByMonth.find(u => u._id === m._id);
            return {
                month: new Date(m._id + '-01').toLocaleDateString('en-US', { month: 'short' }),
                requests: m.requests,
                donations: m.completed,
                users: userMonth?.users || 0
            };
        });

        // Format daily/weekly data
        const weeklyActivity = requestsByDay.map(d => ({
            day: new Date(d._id).toLocaleDateString('en-US', { weekday: 'short' }),
            requests: d.requests,
            donations: d.completed,
            emergencies: d.emergencies
        }));

        res.status(200).json({
            success: true,
            data: {
                weeklyActivity,
                monthlyTrend,
                todayUsers: todayStats.todayUsers,
                todayRequests: todayStats.todayRequests,
                bloodStock
            }
        });
    } catch (error) {
        console.error("getAnalytics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics"
        });
    }
};

// BULK DELETE USERS
export const bulkDeleteUsers = async (req, res) => {
    try {
        const { userIds } = req.body;

        // Simple validation
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of user IDs"
            });
        }

        // Limit to 50 at a time (reasonable limit)
        if (userIds.length > 50) {
            return res.status(400).json({
                success: false,
                message: "Maximum 50 users can be deleted at once"
            });
        }

        // Check if users exist and are not admins
        const users = await User.find({ _id: { $in: userIds } });

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found with provided IDs"
            });
        }

        // Check for admins
        const admins = users.filter(u => u.role === 'admin');
        if (admins.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete admin users"
            });
        }

        // Check for users with active requests
        const activeRequests = await Request.countDocuments({
            patientId: { $in: userIds },
            status: { $in: ['pending', 'accepted'] }
        });

        if (activeRequests > 0) {
            return res.status(400).json({
                success: false,
                message: "Some users have active requests. Please resolve them first."
            });
        }

        // Delete users and related data
        await User.deleteMany({ _id: { $in: userIds } });
        await Request.deleteMany({ patientId: { $in: userIds } });
        await Notification.deleteMany({ user: { $in: userIds } });

        res.status(200).json({
            success: true,
            message: `${users.length} users deleted successfully`,
            data: { deletedCount: users.length }
        });

    } catch (error) {
        console.error("bulkDeleteUsers error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete users"
        });
    }
};

// BULK DELETE REQUESTS
export const bulkDeleteRequests = async (req, res) => {
    try {
        const { requestIds } = req.body;

        // Simple validation
        if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of request IDs"
            });
        }

        // Limit to 50 at a time
        if (requestIds.length > 50) {
            return res.status(400).json({
                success: false,
                message: "Maximum 50 requests can be deleted at once"
            });
        }

        // Check if requests exist
        const requests = await Request.find({
            _id: { $in: requestIds }
        }).populate("patientId acceptedBy");

        if (requests.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No requests found with provided IDs"
            });
        }

        // Don't allow deleting completed requests
        const completedRequests = requests.filter(r => r.status === 'completed');
        if (completedRequests.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete completed requests"
            });
        }

        // Send notifications for accepted requests (simple)
        const acceptedRequests = requests.filter(r => r.status === 'accepted');

        for (const request of acceptedRequests) {
            // Notify donor
            if (request.acceptedBy) {
                await Notification.create({
                    user: request.acceptedBy._id,
                    forRole: "donor",
                    type: "REQUEST_DELETED",
                    title: "Request Deleted",
                    message: `The blood request you accepted has been deleted by admin.`,
                    requestId: request._id,
                });
            }

            // Notify patient
            if (request.patientId) {
                await Notification.create({
                    user: request.patientId._id,
                    forRole: "patient",
                    type: "REQUEST_DELETED",
                    title: "Request Deleted",
                    message: `Your blood request has been deleted by admin.`,
                    requestId: request._id,
                });
            }
        }

        // Delete requests
        await Request.deleteMany({ _id: { $in: requestIds } });

        res.status(200).json({
            success: true,
            message: `${requests.length} requests deleted successfully`,
            data: { deletedCount: requests.length }
        });

    } catch (error) {
        console.error("bulkDeleteRequests error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete requests"
        });
    }
};

// SIMPLE BULK DELETE BY FILTER (Optional - if you really need it)
export const deleteUsersByFilter = async (req, res) => {
    try {
        const { role, city, bloodGroup, available } = req.body;

        // Build filter
        const filter = {};
        if (role) filter.role = role;
        if (city) filter.city = city;
        if (bloodGroup) filter.bloodGroup = bloodGroup;
        if (available !== undefined) filter.available = available;

        // Never allow deleting admins
        filter.role = { $ne: 'admin' };

        // Count users to delete
        const count = await User.countDocuments(filter);

        if (count === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found matching criteria"
            });
        }

        // Get user IDs for related deletions
        const users = await User.find(filter).select('_id');
        const userIds = users.map(u => u._id);

        // Delete everything
        await User.deleteMany(filter);
        await Request.deleteMany({ patientId: { $in: userIds } });
        await Notification.deleteMany({ user: { $in: userIds } });

        res.status(200).json({
            success: true,
            message: `${count} users deleted successfully`,
            data: { deletedCount: count }
        });

    } catch (error) {
        console.error("deleteUsersByFilter error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete users"
        });
    }
};