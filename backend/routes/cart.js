/**
 * @file routes/cart.js
 * @description Endpoints for synchronizing and retrieving user shopping cart state.
 */

const express = require("express");
const router = express.Router();
const clientPromise = require("../services/mongodb");
const authenticateToken = require("../middleware/auth");
const logger = require("../utils/logger");

/**
 * POST /api/cart/update-cart
 * Synchronizes and updates the shopping cart for a user.
 */
router.post('/update-cart', authenticateToken, async (req, res) => {
  const { username, cart } = req.body;
  if (!username || !Array.isArray(cart)) {
    return res.status(400).json({ message: "Username and cart are required." });
  }

  try {
    const client = await clientPromise;
    const db = client.db('BobcatsDB');
    await db.collection('carts').updateOne(
      { username },
      { $set: { cart } },
      { upsert: true }
    );
    res.json({ message: "Cart updated successfully." });
  } catch (error) {
    logger.error('Error en cart:', { error: error.message, stack: error.stack });
    res.status(500).json({ message: "Database error." });
  }
});

/**
 * GET /api/cart/get-cart
 * Retrieves the saved shopping cart for a user.
 */
router.get('/get-cart', authenticateToken, async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ message: "Username is required." });
  }

  try {
    const client = await clientPromise;
    const db = client.db('BobcatsDB');
    const userCart = await db.collection('carts').findOne({ username });
    res.json({ cart: userCart?.cart || [] });
  } catch (error) {
    logger.error('Error en cart:', { error: error.message, stack: error.stack });
    res.status(500).json({ message: "Database error." });
  }
});

module.exports = router;