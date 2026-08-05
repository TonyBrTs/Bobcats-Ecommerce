/**
 * @file middleware/notFound.js
 * @description Middleware para capturar y procesar solicitudes a rutas no existentes (HTTP 404).
 */

/**
 * Genera un error 404 para las rutas que no coinciden con ningún endpoint registrado.
 * 
 * @param {import('express').Request} req - Objeto de solicitud Express.
 * @param {import('express').Response} res - Objeto de respuesta Express.
 * @param {import('express').NextFunction} next - Función para pasar el error al errorHandler.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

module.exports = notFound;

