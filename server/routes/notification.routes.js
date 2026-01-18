import express from "express";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notificationController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();
router.get("/", verifyToken, getMyNotifications);
router.get("/unread-count", verifyToken, getUnreadCount);
router.patch("/:id/read", verifyToken, markAsRead);
router.patch("/read-all", verifyToken, markAllAsRead);
router.delete("/:id", verifyToken, deleteNotification);

export default router;
