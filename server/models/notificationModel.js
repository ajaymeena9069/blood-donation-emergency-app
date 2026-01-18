import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    forRole: {
      type: String,
      enum: ["patient", "donor"],
      required: true,
    },

    title: String,
    message: String,

    type: {
      type: String,
      enum: [
        "REQUEST_CREATED",
        "REQUEST_ACCEPTED",
        "REQUEST_CANCELLED"
      ],
      required: true,
    },

    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
    },

    reason: {
      type: String,
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
