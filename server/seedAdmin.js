import mongoose from "mongoose";
import argon2 from "argon2";
import connectDb from "./config/db.js";
import Admin from "./models/adminModel.js";

const createAdmin = async () => {
    try {
        await connectDb();
        const existingAdmin = await Admin.findOne({ email: "admin@gmail.com" });
        if (existingAdmin) {
            console.log("⚠️ Admin already exists!");
            return;
        }
        const hashedPassword = await argon2.hash("admin9069");

        await Admin.create({
            name: "Super Admin",
            email: "admin@gmail.com",
            password: hashedPassword
        });

        console.log("✅ Admin created successfully!");
        process.exit();
        

    } catch (error) {
        console.error("❌ Error seeding admin:", error);
        process.exit(1);
    }
}

createAdmin();