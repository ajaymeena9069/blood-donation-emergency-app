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
  role: {
    type: [String],
    enum: ["donor", "patient", "admin"],
    default: ["patient"] // Default patient
  },
  activeRole: {
    type: String,
    enum: ["donor", "patient", "admin"],
    default: "patient"
  },

  // --- 3. DONOR SPECIFIC FIELDS ---
  available: {
    type: Boolean,
    default: false // by default false, true only if donor role active
  },
  lastDonationDate: { type: Date },
  nextEligibleDate: { type: Date }, // 90-day cooldown
  totalDonations: { type: Number, default: 0 },

  // --- 4. OPTIONAL / EXTRA FIELDS ---
  address: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
