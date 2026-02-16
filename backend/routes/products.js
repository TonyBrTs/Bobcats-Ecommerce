const express = require('express')
const router = express.Router()
const clientPromise = require('../services/mongodb')

router.get('/', async (req, res) => {
  try {
    const client = await clientPromise
    const db = client.db('BobcatsDB')
    const products = await db.collection('products').find({}).toArray()
    res.json(products)
  } catch (error) {
    console.error('Error fetching products from MongoDB:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router