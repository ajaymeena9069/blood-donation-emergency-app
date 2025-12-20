import Donor from "../models/donorModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

// ==================================================
// Register Donor
// ==================================================
export const registerDonor = async (req, res) => {
    try {
        const { name, email, password, phone, bloodGroup, city, age, gender } = req.body;

        // Validation
        if (!name || !email || !password || !phone || !bloodGroup || !city || !age || !gender) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // Check existing donor
        const existingDonor = await Donor.findOne({ email });
        if (existingDonor) {
            return res.status(400).json({ success: false, message: "Email already registered!" });
        }

        // Hash Password
        const hashPassword = await argon2.hash(password);

        // Create Donor
        const newDonor = new Donor({
            name,
            email,
            password: hashPassword,
            phone,
            bloodGroup,
            city,
            age,
            gender
        });

        await newDonor.save();

        res.status(201).json({
            success: true,
            message: "Donor registered successfully!",
            role: "donor",
            user: {
                id: newDonor._id,
                name: newDonor.name,
                email: newDonor.email,
                phone: newDonor.phone,
                bloodGroup: newDonor.bloodGroup,
                city: newDonor.city,
                age: newDonor.age,
                gender: newDonor.gender,
                available: newDonor.available
            }
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
};

// ==================================================
// Login Donor
// ==================================================
export const loginDonor = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ success: false, message: "Email and Password required!" });

        const donor = await Donor.findOne({ email });
        if (!donor)
            return res.status(404).json({ success: false, message: "Donor not found!" });

        const isMatch = await argon2.verify(donor.password, password);
        if (!isMatch)
            return res.status(400).json({ success: false, message: "Invalid credentials!" });

        // Generate JWT
        const token = jwt.sign(
            { id: donor._id, email: donor.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successfully!",
            token,
            role: "donor",
            user: {
                id: donor._id,
                name: donor.name,
                email: donor.email,
                phone: donor.phone,
                bloodGroup: donor.bloodGroup,
                city: donor.city,
                age: donor.age,
                gender: donor.gender,
                available: donor.available
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
};

// ==================================================
// GET ALL DONORS
// ==================================================
export const getAllDonors = async (req, res) => {
    try {
        const donors = await Donor.find();

        res.status(200).json({
            success: true,
            message: "Donors fetched successfully!",
            data: donors
        });

    } catch (error) {
        console.error("Fetch Donors Error:", error);
        res.status(500).json({ success: false, message: "Server error!", error: error.message });
    }
};

// ==================================================
// Update Donor Availability (SAFE VERSION)
// ==================================================
import mongoose from "mongoose";

export const updateAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { available } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Donor ID!",
            });
        }

        // Find donor
        const donor = await Donor.findById(id);
        if (!donor) {
            return res.status(404).json({
                success: false,
                message: "Donor not found!",
            });
        }

        // Update availability
        donor.available = available;
        await donor.save();

        res.json({
            success: true,
            message: "Availability updated successfully!",
            data: donor,
        });
    } catch (error) {
        console.error("Availability Update Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

