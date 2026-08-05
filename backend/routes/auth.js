/**
 * @file routes/auth.js
 * @description API endpoints for user registration and authentication.
 */

require("dotenv").config();
const express = require("express");
const router = express.Router();
const { validateFields } = require("../utils/validators");
const userService = require("../services/userService");

/**
 * POST /api/users/register
 * Registers a new user account after validating credentials.
 */
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const validation = validateFields({ username, email, password });
  if (!validation.valid) {
    const response = {
      message:
        validation.message || "Error de validación en los campos enviados",
      errors: validation.errors,
      details:
        "Por favor, revisa los campos marcados y corrige los errores antes de continuar",
    };

    if (validation.errors.passwordRules) {
      response.passwordRules = {
        allRules: validation.errors.passwordRules,
        failedRules: validation.errors.passwordFailedRules || [],
        message: "La contraseña debe cumplir todas las siguientes reglas:",
      };
    }

    return res.status(400).json(response);
  }

  try {
    const user = await userService.registerUser(username, email, password);
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user,
    });
  } catch (error) {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      message: error.message || "Error en la base de datos",
    });
  }
});

/**
 * POST /api/users/login
 * Authenticates a user and returns a valid JWT token.
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const validation = validateFields({ email, password });
  if (!validation.valid) {
    const response = {
      message:
        validation.message || "Error de validación en los campos enviados",
      errors: validation.errors,
      details:
        "Por favor, revisa los campos marcados y corrige los errores antes de continuar",
    };

    if (validation.errors.passwordRules) {
      response.passwordRules = {
        allRules: validation.errors.passwordRules,
        failedRules: validation.errors.passwordFailedRules || [],
        message: "La contraseña debe cumplir todas las siguientes reglas:",
      };
    }

    return res.status(400).json(response);
  }

  try {
    const result = await userService.loginUser(email, password);
    res.json({
      message: "Login exitoso",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      message: error.message || "Error en la base de datos",
    });
  }
});

module.exports = router;
