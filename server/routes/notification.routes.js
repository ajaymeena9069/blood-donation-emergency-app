import { Router } from "express";
import {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  // getDonorNotifications,
} from "../controllers/notificationController.js";

import { verifyToken } from "../middlewares/auth.js";

const router = Router();

// CREATE NOTIFICATION
router.post("/", verifyToken, createNotification);

// GET DONOR NOTIFICATIONS (keep above :userId)
// router.get("/donor/:donorId", verifyToken, getDonorNotifications);

// GET ALL (patient+donor)
router.get("/:userId", verifyToken, getNotifications);

// MARK READ
router.put("/read/:id", verifyToken, markAsRead);

// MARK ALL READ
router.put("/read-all/:userId", verifyToken, markAllAsRead);

// DELETE
router.delete("/delete/:id", verifyToken, deleteNotification);

export default router;
