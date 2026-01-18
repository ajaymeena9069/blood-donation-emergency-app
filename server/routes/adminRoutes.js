import express from "express";
import { getAllRequests, getAllUsers, updateRequestStatus } from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
const router = express.Router();

router.get("/requests", verifyToken, isAdmin, getAllRequests);
router.put("/requests/:id", verifyToken, isAdmin, updateRequestStatus);
router.get("/users", verifyToken, isAdmin, getAllUsers);
const adminRoutes = router;
export default adminRoutes;