// models/requestModel.js
import mongoose from "mongoose";

const donorResponseSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "cancel"],
    default: "pending",
  }
}, { _id: false });

const requestSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    bloodGroup: { type: String, required: true },
    units: { type: Number, required: true },
    city: { type: String, required: true },
    hospitalName: { type: String, required: true },

    emergency: { type: Boolean, default: false },

    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
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
