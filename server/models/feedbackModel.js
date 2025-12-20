import mongoose from "mongoose";
const feedbackSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.ObjectId, require: true },
    role: { type: String, enum: ['Donor', 'Patient'], require: true },
    message: { type: String, require: true },
    rating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

export default mongoose.model('Feedback', feedbackSchema);