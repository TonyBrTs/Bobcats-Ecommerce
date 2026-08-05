/**
 * @file middleware/errorHandler.js
 * @description Centralized error handling middleware.
 * Catches application exceptions and formats standardized JSON error responses.
 */

const logger = require("../utils/logger");

/**
 * Global exception handler for Express.
 * 
 * @param {Error} err - Caught error object.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware callback.
 */
const errorHandler = (err, req, res, next) => {
  logger.error("Error capturado:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  if (res.headersSent) {
    return next(err);
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message || "Error de validación",
      ...(process.env.NODE_ENV === "development" && { details: err }),
    });
  }

  if (err.name === "UnauthorizedError" || err.status === 401) {
    return res.status(401).json({
      message: err.message || "No autorizado",
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(403).json({
      message: "Token inválido",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(403).json({
      message: "Token expirado. Por favor inicia sesión nuevamente",
    });
  }

  if (err.name === "MongoError" || err.name === "MongoServerError") {
    return res.status(500).json({
      message: "Error en la base de datos",
      ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      message: err.message || "Error en la solicitud",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  res.status(500).json({
    message: err.message || "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err,
    }),
  });
};

module.exports = errorHandler;

