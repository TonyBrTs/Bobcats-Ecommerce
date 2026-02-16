require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const clientPromise = require("../services/mongodb");
const config = require("../config/env");
const { validateFields } = require("../utils/validators");
const SECRET_KEY = config.jwtSecret;

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Validar campos usando validadores centralizados
  const validation = validateFields({ username, email, password });
  if (!validation.valid) {
    const response = {
      message:
        validation.message || "Error de validación en los campos enviados",
      errors: validation.errors,
      details:
        "Por favor, revisa los campos marcados y corrige los errores antes de continuar",
    };

    // Si hay errores de contraseña, incluir las reglas explícitamente
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
    const client = await clientPromise;
    const db = client.db("BobcatsDB");
    const usersCollection = db.collection("users");

    // Check if email or username already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "El usuario o correo electrónico ya existe" });
    }

    // Get the last user id and increment
    const lastUser = await usersCollection
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    const newUserId = lastUser.length > 0 ? lastUser[0].id + 1 : 1;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: newUserId,
      username,
      email,
      password: hashedPassword,
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: { id: newUserId, username, email },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error en la base de datos" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validar campos usando validadores centralizados
  const validation = validateFields({ email, password });
  if (!validation.valid) {
    const response = {
      message:
        validation.message || "Error de validación en los campos enviados",
      errors: validation.errors,
      details:
        "Por favor, revisa los campos marcados y corrige los errores antes de continuar",
    };

    // Si hay errores de contraseña, incluir las reglas explícitamente
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
    const client = await clientPromise;
    const db = client.db("BobcatsDB");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: config.jwtExpiresIn,
    });

    res.json({
      message: "Login exitoso",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error en la base de datos" });
  }
});

module.exports = router;
