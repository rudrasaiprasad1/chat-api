import "dotenv/config";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
    path:
        process.env.NODE_ENV === "production"
            ? ".env.production"
            : ".env",
});

const envSchema = z.object({
    CORS_ORIGINS: z.string(),
    PORT: z.string().default("3000"),
    DB_HOST: z.string(),
    DB_USER: z.string(),
    DB_PASS: z.string(),
    DB_NAME: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.enum(["15m","30m","1h", "2h", "7d", "30m"]).default("1h"),
});


try {
    envSchema.parse(process.env);
} catch (err) {
    console.error("❌ Invalid ENV:", err);
    process.exit(1);
}

export const env = envSchema.parse(process.env);