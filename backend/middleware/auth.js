/**
 * @file middleware/auth.js
 * @description JWT authentication middleware.
 * Verifies the validity of the bearer token in HTTP headers before granting access to protected routes.
 */

const jwt = require("jsonwebtoken");
const config = require("../config/env");

/**
 * Validates the JWT token present in the `Authorization` header.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware callback.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const headerToken = authHeader && authHeader.split(" ")[1];
  const cookieToken = req.cookies ? req.cookies.token : null;
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ message: "Token de acceso requerido" });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({
          message: "Token expirado. Por favor inicia sesión nuevamente",
        });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(403).json({ message: "Token inválido" });
      }
      return res.status(403).json({ message: "Error al verificar el token" });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
