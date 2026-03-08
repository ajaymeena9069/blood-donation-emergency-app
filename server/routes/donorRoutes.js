import express from "express";
import { getAllDonors, resetDonationTimer } from "../controllers/donorController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();
router.get("/all", getAllDonors);
router.post("/reset-timer", verifyToken, resetDonationTimer);
export default router;
