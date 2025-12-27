
import Notification from "../models/notificationModel.js"
// ---------------- CREATE ----------------
export const createNotification = async (req, res) => {
  try {
    const { title, message, patientId, donorId } = req.body;

    if (!title || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Title & Message required" });
    }

    if (!patientId && !donorId) {
      return res.status(400).json({
        success: false,
        message: "Either patientId or donorId is required",
      });
    }

    const notification = await Notification.create({
      title,
      message,
      patientId: patientId || null,
      donorId: donorId || null,
    });

    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.log("Create Notification Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------- GET NOTIFICATIONS ----------------
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({
      $or: [{ patientId: userId }, { donorId: userId }],
    }).sort({ createdAt: -1 });

    res.json({ success: true, notifications });
  } catch (error) {
    console.log("Get Notifications Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------- MARK SINGLE READ ----------------
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (error) {
    console.log("Mark Read Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------- MARK ALL READ ----------------
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Notification.updateMany(
      {
        $or: [{ patientId: userId }, { donorId: userId }],
      },
      { $set: { read: true } }
    );

    res.json({ success: true });
  } catch (error) {
    console.log("Mark All Read Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ---------------- DELETE ----------------
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.log("Delete Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
