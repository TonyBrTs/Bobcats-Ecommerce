/**
 * @file services/userService.js
 * @description Servicio de lógica de negocio para la gestión, registro y autenticación de usuarios.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const clientPromise = require("./mongodb");
const config = require("../config/env");
const logger = require("../utils/logger");

class UserService {
  /**
   * Registra un nuevo usuario en la base de datos.
   * 
   * @param {string} username - Nombre de usuario.
   * @param {string} email - Correo electrónico del usuario.
   * @param {string} password - Contraseña en texto plano.
   * @returns {Promise<{id: number, username: string, email: string}>} Objeto de usuario registrado.
   */
  async registerUser(username, email, password) {
    try {
      const client = await clientPromise;
      const db = client.db("BobcatsDB");
      const usersCollection = db.collection("users");

      const existingUser = await usersCollection.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        const error = new Error("El usuario o correo electrónico ya existe");
        error.status = 409;
        throw error;
      }

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

      logger.info("Usuario registrado exitosamente", { userId: newUserId, email });

      return { id: newUserId, username, email };
    } catch (error) {
      logger.error("Error en registro de usuario:", {
        error: error.message,
        stack: error.stack,
        email,
      });
      throw error;
    }
  }

  /**
   * Autentica un usuario verificando sus credenciales y emite un token JWT.
   * 
   * @param {string} email - Correo electrónico.
   * @param {string} password - Contraseña en texto plano.
   * @returns {Promise<{token: string, user: {id: number, username: string, email: string}}>} Datos de autenticación.
   */
  async loginUser(email, password) {
    try {
      const client = await clientPromise;
      const db = client.db("BobcatsDB");
      const usersCollection = db.collection("users");

      const user = await usersCollection.findOne({ email });

      if (!user) {
        const error = new Error("Credenciales inválidas");
        error.status = 401;
        throw error;
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        const error = new Error("Credenciales inválidas");
        error.status = 401;
        throw error;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      logger.info("Usuario autenticado exitosamente", { userId: user.id, email });

      return {
        token,
        user: { id: user.id, username: user.username, email: user.email },
      };
    } catch (error) {
      logger.error("Error en login de usuario:", {
        error: error.message,
        email,
      });
      throw error;
    }
  }

  /**
   * Obtiene los datos públicos de un usuario por su ID.
   * 
   * @param {number} userId - ID del usuario.
   * @returns {Promise<{id: number, username: string, email: string} | null>} Objeto de usuario o null.
   */
  async getUserById(userId) {
    try {
      const client = await clientPromise;
      const db = client.db("BobcatsDB");
      const usersCollection = db.collection("users");

      const user = await usersCollection.findOne({ id: userId });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    } catch (error) {
      logger.error("Error obteniendo usuario por ID:", {
        error: error.message,
        userId,
      });
      throw error;
    }
  }
}

module.exports = new UserService();

