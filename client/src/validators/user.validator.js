import { z } from "zod";

const phoneRegex = /^[0-9]{10}$/;
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export const registerSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters")
        .trim(),

    email: z.string()
        .email("Invalid email address")
        .toLowerCase()
        .trim(),

    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(50, "Password must be less than 50 characters"),

    phone: z.string()
        .regex(phoneRegex, "Phone must be 10 digits"),

    bloodGroup: z.enum(bloodGroups, {
        errorMap: () => ({ message: "Invalid blood group" })
    }),

    city: z.string()
        .min(2, "City must be at least 2 characters")
        .max(50, "City must be less than 50 characters")
        .trim(),

    age: z.coerce.number()
        .min(18, "Age must be at least 18")
        .max(65, "Age must be at most 65"),

    gender: z.enum(["male", "female", "other"], {
        errorMap: () => ({ message: "Gender must be male, female, or other" })
    }),

    roleType: z.enum(["donor", "patient", "admin"], {
        errorMap: () => ({ message: "Role must be donor, patient, or admin" })
    }),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters")
        .trim()
        .optional(),

    phone: z.string()
        .regex(phoneRegex, "Phone must be 10 digits")
        .optional(),

    city: z.string()
        .min(2, "City must be at least 2 characters")
        .max(50, "City must be less than 50 characters")
        .trim()
        .optional(),

    age: z.coerce.number()
        .min(18, "Age must be at least 18")
        .max(65, "Age must be at most 65")
        .optional(),

    gender: z.enum(["male", "female", "other"], {
        errorMap: () => ({ message: "Gender must be male, female, or other" })
    }).optional(),

    bloodGroup: z.enum(bloodGroups, {
        errorMap: () => ({ message: "Invalid blood group" })
    }).optional(),

    available: z.boolean().optional(),
});
