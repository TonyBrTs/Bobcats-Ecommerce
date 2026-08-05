/**
 * @file middleware/notFound.js
 * @description Middleware for catching and processing 404 Not Found requests.
 */

/**
 * Generates a 404 error for routes that do not match any registered endpoint.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware callback.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

module.exports = notFound;

