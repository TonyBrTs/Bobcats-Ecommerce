/**
 * @file config/env.js
 * @description Configuration and validation module for environment variables.
 * Ensures the server has all required credentials before starting.
 */

require("dotenv").config();

const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("Error: Missing required environment variables:");
  missingVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.error("\nPlease create a .env file with these variables.");
  process.exit(1);
}

if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.warn(
    "⚠️  Warning: JWT_SECRET should be at least 32 characters long for enhanced security."
  );
}

/**
 * Global application configuration object.
 */
module.exports = {
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};
