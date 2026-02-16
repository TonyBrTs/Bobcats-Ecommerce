// Validar variables de entorno antes de continuar
require("./config/env");

const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const config = require("./config/env");
const logger = require("./utils/logger");

const app = express();
const PORT = config.port;

// Configuración de CORS
const corsOptions = {
  origin: config.frontendUrl,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Rate Limiting - Protección contra ataques de fuerza bruta y abuso
// Limiter general para todas las rutas API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP en la ventana de tiempo
  message: { message: "Demasiados intentos desde esta IP, intenta más tarde" },
  standardHeaders: true, // Retorna rate limit info en headers
  legacyHeaders: false,
});

// Limiter más estricto para login (protección contra fuerza bruta)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por IP
  message: { message: "Demasiados intentos de login, intenta más tarde" },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No cuenta requests exitosos
});

// Primero: Middlewares globales
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Aplicar rate limiting a todas las rutas API
app.use("/api/", apiLimiter);

// Luego: Rutas
const productsRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const favoriteRoutes = require("./routes/favorite");
const purchaseHistoryRoutes = require("./routes/purchase-history");

app.use("/api/products", productsRoutes);
// Aplicar rate limiting estricto solo a login
app.use("/api/users/login", loginLimiter);
app.use("/api/users", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/purchase-history", purchaseHistoryRoutes);

// Manejo de rutas no encontradas (debe ir antes del error handler)
const notFound = require("./middleware/notFound");
app.use(notFound);

// Manejo centralizado de errores (debe ir al final, después de todas las rutas)
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// Arrancar servidor
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en http://localhost:${PORT}`);
  logger.info(`Entorno: ${config.nodeEnv}`);
});
