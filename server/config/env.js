import z from "zod";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const envSchema = z.object({
    PORT: z.coerce.number().default(5000),
    MONGO_URL: z.string().url().or(z.string().startsWith("mongodb://")),
    JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters long"),
    EMAIL_USER: z.string()
        .email("Invalid email address")
        .toLowerCase()
        .trim(),
    EMAIL_PASSWORD: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(50, "Password must be less than 50 characters"),
    FRONTEND_URL: z.string().url()
});

const env = envSchema.parse(process.env);

export const { PORT, MONGO_URL, JWT_SECRET, EMAIL_USER, EMAIL_PASSWORD, FRONTEND_URL } = env;