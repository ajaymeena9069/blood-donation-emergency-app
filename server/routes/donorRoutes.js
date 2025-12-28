import express from "express";
import { getAllDonors } from "../controllers/donorController.js";
// import { verifyToken } from "../middlewares/authMiddleware.js";
// import { getDonorMatches } from "../controllers/requestController.js";


const router = express.Router();
router.get("/all", getAllDonors);
export default router;
