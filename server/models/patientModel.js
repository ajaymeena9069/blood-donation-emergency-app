import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  city: { type: String, required: true },
  hospitalName: { type: String},
}, { timestamps: true });

const Patient =  mongoose.model("Patient", patientSchema);
export default Patient;
