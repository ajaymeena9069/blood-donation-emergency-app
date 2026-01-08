import mongoose from "mongoose";

const donorResponseSchema = new mongoose.Schema({
  // Ref changed to "User"
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "cancel"],
    default: "pending",
  }
}, { _id: false });

const requestSchema = new mongoose.Schema(
  {
    // Ref changed to "User"
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bloodGroup: { type: String, required: true },
    units: { type: Number, required: true },
    city: { type: String, required: true },
    hospitalName: { type: String, required: true },

    emergency: { type: Boolean, default: false },

    // Ref changed to "User"
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    donorResponses: [donorResponseSchema],

    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancel"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);
export default Request;