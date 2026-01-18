import express from "express";
import {
  createRequest,
  getPatientRequests,
  getSingleRequest,
  getMatchedRequests,
  acceptRequest,
  cancelRequest,
  deleteRequest,
  updateRequest,
} from "../controllers/requestController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", verifyToken, createRequest);

router.get("/patient/:patientId/requests", verifyToken, getPatientRequests);

router.get("/single/:id", verifyToken, getSingleRequest);

router.get("/donor/matches", verifyToken, getMatchedRequests);

router.post("/:id/accept", verifyToken, acceptRequest);

router.post("/:id/cancel", verifyToken, cancelRequest);

router.delete("/:id", verifyToken, deleteRequest);

router.put("/:id", verifyToken, updateRequest);
export default router;
