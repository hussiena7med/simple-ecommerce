/**
 * Centralized environment configuration
 * This file should be imported first to ensure environment variables are loaded
 */
import dotenv from "dotenv";

// Load environment variables only once
const result = dotenv.config({
  debug: false, // Disable verbose dotenv messages
  override: false, // Don't override existing env vars
});

if (result.error && process.env.NODE_ENV !== "production") {
  console.warn("⚠️  Could not load .env file:", result.error.message);
}

// Validate required environment variables
const requiredEnvVars = ["DB_HOST", "DB_USERNAME", "DB_DATABASE", "PORT"];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0 && process.env.NODE_ENV !== "test") {
  console.error("❌ Missing required environment variables:", missingEnvVars);
  process.exit(1);
}

export const config = {
  // Database
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "second_chance",
  },
  // Application
  app: {
    port: parseInt(process.env.PORT || "3000"),
    env: process.env.NODE_ENV || "development",
    secret: process.env.APP_SECRET || "default-secret",
  },
  // JWT (if needed later)
  jwt: {
    secret: process.env.JWT_SECRET || "jwt-secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
};

export default config;
