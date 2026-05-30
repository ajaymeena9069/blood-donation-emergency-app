import mongoose from "mongoose";
import argon2 from "argon2";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import connectDB from "./config/db.js";

dotenv.config();

const forceResetAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = "ajaymeena62408@gmail.com";
        const hashedPassword = await argon2.hash("admin9069");

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            await User.updateOne(
                { email: adminEmail },
                { 
                    $set: { 
                        password: hashedPassword, 
                        status: "active",
                        role: ["admin"],
                        activeRole: "admin",
                        age: 21,
                        city: "Indore",
                        bloodGroup: "O+",
                        phone: "9516624030"
                    } 
                }
            );
            console.log("✅ Admin password FORCIBLY reset to 'admin9069' and fields fixed!");
        } else {
            const admin = await User.create({
                name: "Admin Ajay",
                email: adminEmail,
                password: hashedPassword,
                phone: "9516624030",
                bloodGroup: "O+",
                city: "Indore",
                age: 21,
                gender: "Male",
                role: ["admin"],
                activeRole: "admin",
                status: "active",
                available: false,
            });
            console.log("🔥 Admin created successfully!");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error resetting admin:", error);
        process.exit(1);
    }
};

forceResetAdmin();
