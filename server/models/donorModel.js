import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },               
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },           
  phone: { type: String, required: true, match: /^[0-9]{10}$/ }, 
  bloodGroup: { type: String, required: true },         
  city: { type: String, required: true },               
  age: { type: Number, required: true },                
  gender: { type: String, required: true}, 
  available: { type: Boolean, default: true },          
  lastDonationDate: { type: Date },                   
}, { timestamps: true });

const Donor = mongoose.model("Donor", donorSchema);
export default Donor;
