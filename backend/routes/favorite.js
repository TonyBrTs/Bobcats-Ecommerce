const express = require('express');
const router = express.Router();
const clientPromise = require('../services/mongodb');

router.post("/update-favorites", async (req, res) => {
  const { username, favorites } = req.body;
  if (!username || !Array.isArray(favorites)) {
    return res.status(400).json({ message: "Username and favorites are required." });
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
    res.status(500).json({ message: "Database error.", error });
  }
});

// Get favorites for a user
router.get("/get-favorites", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: "Username is required." });
  }

  try {
    const client = await clientPromise;
    const db = client.db('BobcatsDB');
    const userFav = await db.collection('favorites').findOne({ username });
    res.json({ favorites: userFav?.favorites || [] });
  } catch (error) {
    res.status(500).json({ message: "Database error.", error });
  }
});

module.exports = router;