const express = require("express");
const router = express.Router();
const clientPromise = require("../services/mongodb");

router.post('/update-cart', async (req, res) => {
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
    res.status(500).json({ message: "Database error.", error });
  }
});

router.get('/get-cart', async (req, res) => {
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
    res.status(500).json({ message: "Database error.", error });
  }
});

module.exports = router;