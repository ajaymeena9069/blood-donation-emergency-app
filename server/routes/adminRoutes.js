import express from "express";
import { getAllRequests, loginAdmin, updateRequestStatus } from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/auth.js";
const router = express.Router();

router.post("/login", loginAdmin);
router.get("/requests", verifyToken, getAllRequests);
router.put("/requests/:id", verifyToken, updateRequestStatus);

const adminRoutes = router;
export default adminRoutes;