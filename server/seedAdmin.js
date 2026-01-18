import mongoose from "mongoose";
import argon2 from "argon2";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import connectDB from "./config/db.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = "ajaymeena62408@gmail.com";
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("✅ Admin already exists");
            process.exit(0);
        }
        const hashedPassword = await argon2.hash("admin9069");

        const admin = await User.create({
            name: "Admin Ajay",
            email: adminEmail,
            password: hashedPassword,
            phone: "9516624030",
            bloodGroup: "O+",
            city: "System",
            age: 21,
            gender: "male",
            role: ["admin"],
            activeRole: "admin",
            available: false,
        });

        console.log("🔥 Admin created successfully");
        console.log({
            email: admin.email,
            role: admin.role,
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
