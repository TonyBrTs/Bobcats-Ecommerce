/**
 * @file routes/purchase-history.js
 * @description Endpoints para registrar y obtener el historial de compras finalizadas del usuario.
 */

const express = require('express');
const router = express.Router();
const clientPromise = require('../services/mongodb');
const authenticateToken = require('../middleware/auth');
const logger = require('../utils/logger');

/**
 * POST /api/purchase-history/add-purchase
 * Registra una nueva compra en el historial del usuario.
 */
router.post("/add-purchase", authenticateToken, async (req, res) => {
  const { username, purchase } = req.body;

  if (!username || !purchase) {
    return res.status(400).json({ message: "Username and purchase data are required." });
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
 * Obtiene la lista completa de compras pasadas registradas por el usuario.
 */
router.get("/get-purchase-history", authenticateToken, async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: "Username is required." });
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
