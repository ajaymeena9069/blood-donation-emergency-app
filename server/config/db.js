import mongoose from "mongoose";
import { MONGO_URL } from "./env.js";
const connectDb = async () => {
    try {
        mongoose.connect(MONGO_URL)
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDb;