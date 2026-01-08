import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // --- 1. COMMON FIELDS (Har user ke liye zaruri hai) ---
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  bloodGroup: { type: String, required: true },
  city: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },

  // --- 2. ROLE MANAGEMENT ---
  // Array use kiya hai kyunki ek banda Donor aur Patient dono ho sakta hai
  role: { 
    type: [String], 
    enum: ["donor", "patient", "admin"], 
    default: ["patient"] // Default patient rakha hai
  },

  // --- 3. DONOR SPECIFIC FIELDS ---
  // Ye fields sirf tab bhari jayengi jab role mein "donor" hoga
  available: { 
    type: Boolean, 
    default: true 
  },
  lastDonationDate: { 
    type: Date 
  },
  // --- 5. EXTRA USEFUL FIELDS (Optional par recommended) ---
  // address: { type: String },
  // profilePicture: { type: String, default: "" },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;