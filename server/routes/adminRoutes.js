import express from "express";
import { 
    getDashboardStats, 
    getAllRequests, 
    getAllUsers,
    createUser,
    updateRequestStatus, 
    updateUserStatus,
    deleteUser,
    deleteRequest,
    getRecentActivities,
    getAnalytics,
    bulkDeleteUsers,
    bulkDeleteRequests
} from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

// Dashboard
router.get("/dashboard/stats", verifyToken, isAdmin, getDashboardStats);
router.get("/dashboard/activities", verifyToken, isAdmin, getRecentActivities);
router.get("/dashboard/analytics", verifyToken, isAdmin, getAnalytics);

// Requests Management
router.get("/requests", verifyToken, isAdmin, getAllRequests);
router.put("/requests/:id", verifyToken, isAdmin, updateRequestStatus);
router.delete("/requests/:id", verifyToken, isAdmin, deleteRequest);

// Users Management
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.post("/users", verifyToken, isAdmin, createUser);
router.put("/users/:id/status", verifyToken, isAdmin, updateUserStatus);
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);
router.post("/users/bulk-delete", verifyToken, isAdmin, bulkDeleteUsers);

// Requests Management - Bulk Delete
router.post("/requests/bulk-delete", verifyToken, isAdmin, bulkDeleteRequests);

const adminRoutes = router;
export default adminRoutes;