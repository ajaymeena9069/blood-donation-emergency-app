import Notification from "../models/notificationModel.js";
import mongoose from "mongoose";

/* --------------------------
   GET MY NOTIFICATIONS
--------------------------- */
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role } = req.query;

    if (!role || !["patient", "donor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role is required (patient or donor)",
      });
    }

    const notifications = await Notification.find({
      user: userId,
      forRole: role,
    })
      .populate("requestId", "bloodGroup city hospitalName status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (err) {
    console.error("getMyNotifications error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* --------------------------
   MARK SINGLE AS READ
--------------------------- */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification id",
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      user: userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (err) {
    console.error("markAsRead error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* --------------------------
   MARK ALL AS READ
   role = patient | donor
--------------------------- */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role } = req.query;

    if (!role || !["patient", "donor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role is required (patient or donor)",
      });
    }

    await Notification.updateMany(
      { user: userId, forRole: role, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    console.error("markAllAsRead error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* --------------------------
   DELETE NOTIFICATION
--------------------------- */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification id",
      });
    }

    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (err) {
    console.error("deleteNotification error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* --------------------------
   GET UNREAD COUNT
   role = patient | donor
--------------------------- */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role } = req.query;

    if (!role || !["patient", "donor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role is required (patient or donor)",
      });
    }

    const count = await Notification.countDocuments({
      user: userId,
      forRole: role,
      isRead: false,
    });

    res.json({
      success: true,
      count,
    });
  } catch (err) {
    console.error("getUnreadCount error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
