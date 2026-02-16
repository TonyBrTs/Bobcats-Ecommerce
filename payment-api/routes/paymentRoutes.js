const express = require("express");
const { processPayment } = require("../controllers/paymentController");

const router = express.Router();

// Ruta POST para procesar el pago
router.post("/", processPayment);

module.exports = router;
