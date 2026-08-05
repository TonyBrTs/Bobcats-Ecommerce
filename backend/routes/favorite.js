/**
 * @file routes/favorite.js
 * @description Endpoints for synchronizing and retrieving user favorite products.
 */

const express = require('express');
const router = express.Router();
const clientPromise = require('../services/mongodb');
const authenticateToken = require('../middleware/auth');
const logger = require('../utils/logger');

/**
 * POST /api/favorite/update-favorites
 * Synchronizes and updates the favorite items list for the authenticated user.
 */
router.post("/update-favorites", authenticateToken, async (req, res) => {
  const { favorites } = req.body;
  const username = req.user?.username || req.body.username;

  if (!username || !Array.isArray(favorites)) {
    return res.status(400).json({ message: "Favorites array and authenticated user are required." });
  }

  try {
    const client = await clientPromise;
    const db = client.db('BobcatsDB');
    await db.collection('favorites').updateOne(
      { username },
      { $set: { favorites } },
      { upsert: true }
    );
    res.json({ message: "Favorites updated successfully." });
  } catch (error) {
    logger.error('Error en favorites:', { error: error.message, stack: error.stack });
    res.status(500).json({ message: "Database error." });
  }
});

/**
 * GET /api/favorite/get-favorites
 * Retrieves the saved favorites list for the authenticated user.
 */
router.get("/get-favorites", authenticateToken, async (req, res) => {
  const username = req.user?.username || req.query.username;

  if (!username) {
    return res.status(400).json({ message: "Authenticated username is required." });
  }

  try {
    const client = await clientPromise;
    const db = client.db('BobcatsDB');
    const userFav = await db.collection('favorites').findOne({ username });
    res.json({ favorites: userFav?.favorites || [] });
  } catch (error) {
    logger.error('Error en favorites:', { error: error.message, stack: error.stack });
    res.status(500).json({ message: "Database error." });
  }
});

module.exports = router;