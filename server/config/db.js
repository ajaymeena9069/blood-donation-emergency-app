import mongoose from "mongoose";
import { MONGO_URL } from "./env.js";

const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URL, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        console.log("⚠️  Server will continue without database...");
        // Don't exit, let server run
    }
}

export default connectDb;