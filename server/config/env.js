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
    BREVO_API_KEY: z.string().min(1, "BREVO_API_KEY is required"),
    BREVO_SENDER_EMAIL: z.string().email("Invalid sender email address"),
    // FRONTEND_URL is used by the server when constructing links sent to users.
    // Provide a default so the app still starts if the variable is missing or
    // accidentally set to a non-URL during deployment. The schema will coerce
    // or fall back to localhost for local development.
    FRONTEND_URL: z
        .string()
        .url({ message: "FRONTEND_URL must be a valid URL" })
        .default("http://localhost:5173")
});

const env = envSchema.parse(process.env);

export const { PORT, MONGO_URL, JWT_SECRET, BREVO_API_KEY, BREVO_SENDER_EMAIL, FRONTEND_URL } = env;