import mongoose from "mongoose";
import argon2 from "argon2";

const MONGO_URL = "mongodb+srv://ajay:ajay9069@cluster0.i6gcumr.mongodb.net/blood-donation?retryWrites=true&w=majority";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    bloodGroup: String,
    city: String,
    age: Number,
    gender: String,
    role: [String],
    activeRole: String,
    status: String,
    available: Boolean,
});

const User = mongoose.model("User", userSchema);

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Connected to MongoDB");

        const hashedPassword = await argon2.hash("admin9069");

        const admin = await User.create({
            name: "Admin Ajay",
            email: "ajaymeena62408@gmail.com",
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

        console.log("🔥 Admin created!");
        console.log("Email:", admin.email);
        console.log("Password: admin9069");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

seedAdmin();
