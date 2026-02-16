const { validateCardData } = require("../utils/validateCard");

exports.processPayment = (req, res) => {
  const { cardNumber, expiryDate, cvc, currency } = req.body;

  const result = validateCardData(cardNumber, expiryDate, cvc, currency);

  if (!result.valid) {
    return res.status(400).json({
      success: false,
      message: result.message,
    });
  }

  // Si todo es válido, se aprueba la transacción
  return res.json({
    success: true,
    message: "Transacción aprobada",
  });
};
