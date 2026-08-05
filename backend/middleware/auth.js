/**
 * @file middleware/auth.js
 * @description Middleware de autenticación JWT.
 * Verifica la validez del token recibido en los encabezados HTTP antes de permitir el acceso a rutas protegidas.
 */

const jwt = require("jsonwebtoken");
const config = require("../config/env");

/**
 * Verifica la validez del token JWT presente en el header `Authorization`.
 * 
 * @param {import('express').Request} req - Objeto de solicitud Express.
 * @param {import('express').Response} res - Objeto de respuesta Express.
 * @param {import('express').NextFunction} next - Función para continuar al siguiente middleware.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

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
