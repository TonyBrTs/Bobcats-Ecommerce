const jwt = require("jsonwebtoken");
const config = require("../config/env");

/**
 * Middleware de autenticación JWT
 * Verifica que el token sea válido y no esté expirado
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "Token de acceso requerido" });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(403)
          .json({
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
