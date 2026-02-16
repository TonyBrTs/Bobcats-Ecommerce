const express = require('express')
const router = express.Router()
const clientPromise = require('../services/mongodb')
const logger = require('../utils/logger')

router.get('/', async (req, res) => {
  try {
    const client = await clientPromise
    const db = client.db('BobcatsDB')
    const products = await db.collection('products').find({}).toArray()
    res.json(products)
  } catch (error) {
    logger.error('Error fetching products from MongoDB:', { error: error.message, stack: error.stack })
    res.status(500).json({ message: 'Error al obtener productos' })
  }
})

module.exports = router