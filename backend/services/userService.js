/**
 * @file services/userService.js
 * @description Business logic service for user management, registration, and authentication.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const clientPromise = require("./mongodb");
const config = require("../config/env");
const logger = require("../utils/logger");

class UserService {
  /**
   * Registers a new user account into the database.
   * 
   * @param {string} username - Account username.
   * @param {string} email - User email address.
   * @param {string} password - Raw unhashed password.
   * @returns {Promise<{id: number, username: string, email: string}>} Created user object.
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
   * Authenticates a user by validating credentials and issuing a JWT token.
   * 
   * @param {string} email - Account email.
   * @param {string} password - Raw unhashed password.
   * @returns {Promise<{token: string, user: {id: number, username: string, email: string}}>} Authentication payload.
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
        { id: user.id, email: user.email, username: user.username },
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
   * Retrieves public user details by user ID.
   * 
   * @param {number} userId - User ID.
   * @returns {Promise<{id: number, username: string, email: string} | null>} User object or null.
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

