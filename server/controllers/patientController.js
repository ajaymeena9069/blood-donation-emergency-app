import Patient from "../models/patientModel.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { JWT_SECRET } from "../config/env.js";

// ───────── REGISTER PATIENT ─────────

const registerPatient = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            bloodGroup,
            city,
            age,
            gender,
            hospitalName
        } = req.body;

        if (!name || !email || !password || !phone || !bloodGroup || !city || !age || !gender)
            return res.status(400).json({ success: false, message: "All fields are required" });

        if (phone.length !== 10 || !/^[0-9]+$/.test(phone)) {
            return res.status(400).json({ success: false, message: "Phone number must be 10 digits" });
        }

        if (age < 0 || age > 120) {
            return res.status(400).json({ success: false, message: "Please enter a valid age" });
        }

        const existingPatient = await Patient.findOne({ email });
        if (existingPatient)
            return res.status(400).json({ success: false, message: "Email already registered!" });

        const hashPassword = await argon2.hash(password);

        const newPatient = new Patient({
            name,
            email,
            password: hashPassword,
            phone,
            bloodGroup,
            city,
            age,
            gender,
            hospitalName
        });

        await newPatient.save();

        res.status(201).json({
            success: true,
            message: "Patient registered successfully!",
            role: "patient",
            user: {
                id: newPatient._id,
                name: newPatient.name,
                email: newPatient.email,
                phone: newPatient.phone,
                bloodGroup: newPatient.bloodGroup,
                city: newPatient.city,
                age: newPatient.age,
                gender: newPatient.gender,
                hospitalName: newPatient.hospitalName
            }
        });

    } catch (error) {
        console.error("Register error ", error);
        return res.status(500).json({
            success: false,
            message: "Server error!",
            error: error.message
        });
    }
};

// ───────── LOGIN PATIENT ─────────

const loginPatient = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ success: false, message: "Email and Password required!" });

        const patient = await Patient.findOne({ email });

        if (!patient)
            return res.status(400).json({ success: false, message: "Patient not found" });

        const isMatch = await argon2.verify(patient.password, password);

        if (!isMatch)
            return res.status(400).json({ success: false, message: "Invalid credentials!" });

        // Add role inside token
        const token = jwt.sign(
            { id: patient._id, email: patient.email, role: "patient" },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Patient logged in successfully!",
            token,
            role: "patient",              // ← important
            user: {                       // ← final user data for frontend
                id: patient._id,
                name: patient.name,
                email: patient.email,
                phone: patient.phone,
                bloodGroup: patient.bloodGroup,
                city: patient.city,
                age: patient.age,
                gender: patient.gender,
                hospitalName: patient.hospitalName
            }
        });

    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({
            success: false,
            message: "Server error!",
            error: error.message
        });
    }
};

export { registerPatient, loginPatient };
