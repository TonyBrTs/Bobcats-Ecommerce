/**
 * @file server.js
 * @description Punto de entrada principal para el servidor Backend de Bobcats Ecommerce.
 * Configura middlewares globales (CORS, Rate Limiting, JSON Parsing),
 * inicializa el enrutamiento API y maneja errores globales.
 */

require("./config/env");

const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const config = require("./config/env");
const logger = require("./utils/logger");

const app = express();
const PORT = config.port;

const allowedOrigins = [
  config.frontendUrl,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://bobcats-ecommerce.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Demasiados intentos desde esta IP, intenta más tarde" },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Demasiados intentos de login, intenta más tarde" },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/", apiLimiter);

const productsRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const favoriteRoutes = require("./routes/favorite");
const purchaseHistoryRoutes = require("./routes/purchase-history");

app.use("/api/products", productsRoutes);
app.use("/api/users/login", loginLimiter);
app.use("/api/users", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/purchase-history", purchaseHistoryRoutes);

const notFound = require("./middleware/notFound");
app.use(notFound);

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Servidor corriendo en http://localhost:${PORT}`);
  logger.info(`Entorno: ${config.nodeEnv}`);
});
