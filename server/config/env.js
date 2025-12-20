import z from "zod";
import doteenv from "dotenv";

doteenv.config();
const envSchema = z.object({
    PORT: z.coerce.number().default(5000),
    MONGO_URL: z.string().url().or(z.string().startsWith("mongodb://")),
    JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters long"),
});

const env = envSchema.parse(process.env);

export const { PORT, MONGO_URL, JWT_SECRET } = env;