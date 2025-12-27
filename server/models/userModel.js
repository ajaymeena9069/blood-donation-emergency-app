import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // --- 1. COMMON FIELDS (Required for everyone) ---
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  bloodGroup: { type: String, required: true },
  city: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },

  // --- 2. ROLE MANAGEMENT ---
  role: { 
    type: [String], 
    enum: ["donor", "patient", "admin"], 
    required: true
  },

  // --- 3. DONOR SPECIFIC (Optional) ---
  available: { type: Boolean, default: true },
  lastDonationDate: { type: Date },

  // --- 4. PATIENT SPECIFIC (Optional) ---
  medicalHistory: { type: String, default: "" }, 
  
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;