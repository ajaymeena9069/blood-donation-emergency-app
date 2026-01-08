import express from "express";
import {
   createRequest,
   getPatientRequests,
   getSingleRequest,
   getMatchedRequests,
   handleDonorResponse,
   // getDonorNotifications,
   // adminGetAllRequests,
   // adminUpdateStatus
} from "../controllers/requestController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", verifyToken, createRequest);
router.get("/patient/:patientId/requests", verifyToken, getPatientRequests);
router.get("/single/:id", verifyToken, getSingleRequest);
router.get("/donor/matches", verifyToken, getMatchedRequests);
router.put("/donor/respond/:requestId", verifyToken, handleDonorResponse);
// router.get("/donor/notifications", verifyToken, getDonorNotifications);

// router.get("/admin/requests", verifyToken, adminGetAllRequests);
// router.put("/admin/requests/:id", verifyToken, adminUpdateStatus);

// 🟢 FIX: export router directly
export default router;
