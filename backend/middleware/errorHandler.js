/**
 * Middleware centralizado para manejo de errores
 * Captura todos los errores y los formatea de manera consistente
 */

const errorHandler = (err, req, res, next) => {
  // Log del error completo en el servidor
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Si la respuesta ya fue enviada, delegar al handler por defecto de Express
  if (res.headersSent) {
    return next(err);
  }

  // Errores de validación
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message || "Error de validación",
      ...(process.env.NODE_ENV === "development" && { details: err }),
    });
  }

  // Errores de autenticación/autorización
  if (err.name === "UnauthorizedError" || err.status === 401) {
    return res.status(401).json({
      message: err.message || "No autorizado",
    });
  }

  // Errores de JWT
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

  // Errores de base de datos
  if (err.name === "MongoError" || err.name === "MongoServerError") {
    return res.status(500).json({
      message: "Error en la base de datos",
      ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
  }

  // Errores con status code definido
  if (err.status) {
    return res.status(err.status).json({
      message: err.message || "Error en la solicitud",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  // Error genérico (500)
  res.status(500).json({
    message: err.message || "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err,
    }),
  });
};

module.exports = errorHandler;

