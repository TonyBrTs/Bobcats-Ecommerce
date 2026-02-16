const BIN_CR = require("./bins.json");

function validateCardData(cardNumber, expiryDate, cvc, currency) {
  // Validar número de tarjeta (16 dígitos)
  if (!/^\d{16}$/.test(cardNumber)) {
    return { valid: false, message: "Número de tarjeta inválido (debe tener 16 dígitos)" };
  }

  // Validar BIN (primeros 6 dígitos)
  const bin = cardNumber.substring(0, 6);
  if (!BIN_CR.includes(bin)) {
    return { valid: false, message: "El BIN no corresponde a un banco de Costa Rica" };
  }

  // Validar formato de fecha MM/AA
  const [mm, yy] = expiryDate.split("/");
  if (!mm || !yy || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
    return { valid: false, message: "Formato de fecha inválido. Use MM/AA" };
  }

  // Validar que la tarjeta no esté vencida
  const expDate = new Date(`20${yy}`, parseInt(mm));
  const now = new Date();
  now.setMonth(now.getMonth() + 1);
  if (expDate <= now) {
    return { valid: false, message: "La tarjeta está vencida o vence este mes" };
  }

  // Validar CVC (3 o 4 dígitos)
  if (!/^\d{3,4}$/.test(cvc)) {
    return { valid: false, message: "CVC inválido (debe tener 3 o 4 dígitos)" };
  }

  // Validar moneda
  if (!["CRC", "USD"].includes(currency)) {
    return { valid: false, message: "Moneda no soportada (solo CRC o USD)" };
  }

  return { valid: true };
}

module.exports = { validateCardData };
