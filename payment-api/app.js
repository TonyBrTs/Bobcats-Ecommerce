const express = require("express");
const cors = require("cors");
require("dotenv").config(); // si en el futuro usás un archivo .env

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`API de pagos corriendo en http://localhost:${PORT}`);
});
