import mongoose from "mongoose";

const donorResponseSchema = new mongoose.Schema(
  {
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "accepted", "cancelled"],
      default: "pending",
    },
    respondedAt: Date,
    cancellationReason: String,
  },
  { _id: false }
);
const requestSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName: String,

    bloodGroup: String,
    units: Number,

    city: String,
    hospitalName: String,

    emergency: { type: Boolean, default: false },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    acceptedAt: Date,
    completedAt: Date,

    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "rejected"],
      default: "pending",
    },

    rejectionReason: String,
    rejectedAt: Date,

    donorResponses: [donorResponseSchema],
    cancellationHistory: [
      {
        cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reason: String,
        cancelledAt: Date,
      },
    ],
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);
export default Request;
