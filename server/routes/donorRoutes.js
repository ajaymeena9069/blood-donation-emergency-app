import express from "express";
import { getAllDonors, loginDonor, registerDonor, updateAvailability } from "../controllers/donorController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getDonorMatches } from "../controllers/requestController.js";


const router = express.Router();

// ✅ all routes
router.post("/register", registerDonor);
router.post("/login", loginDonor);
router.get("/requests", verifyToken, getDonorMatches);

router.get("/all", getAllDonors);
// router.get("/:id", getSingleDonor);
router.put("/availability/:id", verifyToken, updateAvailability);
export default router;
