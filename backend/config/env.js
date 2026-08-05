/**
 * @file config/env.js
 * @description Módulo de configuración y validación de variables de entorno.
 * Garantiza que el servidor cuente con las credenciales requeridas antes de iniciar.
 */

require("dotenv").config();

const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("Error: Faltan variables de entorno requeridas:");
  missingVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.error("\nPor favor, crea un archivo .env con estas variables.");
  process.exit(1);
}

if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.warn(
    "⚠️  Advertencia: JWT_SECRET debería tener al menos 32 caracteres para mayor seguridad."
  );
}

/**
 * Objeto de configuración global de la aplicación.
 */
module.exports = {
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};
