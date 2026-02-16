const express = require('express');
const router = express.Router();
const clientPromise = require('../services/mongodb');

// POST: Agregar una nueva compra al historial
router.post("/add-purchase", async (req, res) => {
  const { username, purchase } = req.body;

  if (!username || !purchase) {
    return res.status(400).json({ message: "Username and purchase data are required." });
  }

  try {
    const client = await clientPromise;
    const db = client.db('BobcatsDB');

    await db.collection('purchaseHistory').updateOne(
      { username },
      { $push: { purchases: purchase } }, // Agrega la nueva compra al arreglo existente
      { upsert: true }                    // Crea el documento si no existe
    );

    res.json({ message: "Purchase added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Database error.", error });
  }
});


// GET: Obtener historial de compras
router.get("/get-purchase-history", async (req, res) => {
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
    res.status(500).json({ message: "Database error.", error });
  }
});

module.exports = router;
