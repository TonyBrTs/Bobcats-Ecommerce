/**
 * @file routes/purchase-history.js
 * @description Endpoints for recording and retrieving completed user purchases.
 */

const express = require('express');
const router = express.Router();
const clientPromise = require('../services/mongodb');
const authenticateToken = require('../middleware/auth');
const logger = require('../utils/logger');

/**
 * POST /api/purchase-history/add-purchase
 * Adds a completed purchase transaction to the user history.
 */
router.post("/add-purchase", authenticateToken, async (req, res) => {
  const { purchase } = req.body;
  const username = req.user?.username || req.body.username;

  if (!username || !purchase) {
    return res.status(400).json({ message: "Authenticated user and purchase data are required." });
  }

  try {
    const client = await clientPromise;
    const db = client.db('BobcatsDB');

    await db.collection('purchaseHistory').updateOne(
      { username },
      { $push: { purchases: purchase } },
      { upsert: true }
    );

    res.json({ message: "Purchase added successfully." });
  } catch (error) {
    logger.error('Error en purchase-history:', { error: error.message, stack: error.stack });
    res.status(500).json({ message: "Database error." });
  }
});

/**
 * GET /api/purchase-history/get-purchase-history
 * Fetches the complete list of previous purchases recorded for the authenticated user.
 */
router.get("/get-purchase-history", authenticateToken, async (req, res) => {
  const username = req.user?.username || req.query.username;

  if (!username) {
    return res.status(400).json({ message: "Authenticated username is required." });
  }

  try {
    const client = await clientPromise;
    const db = client.db('BobcatsDB');
    const userPurchases = await db.collection('purchaseHistory').findOne({ username });

    res.json({ purchases: userPurchases?.purchases || [] });
  } catch (error) {
    logger.error('Error en purchase-history:', { error: error.message, stack: error.stack });
    res.status(500).json({ message: "Database error." });
  }
});

module.exports = router;
