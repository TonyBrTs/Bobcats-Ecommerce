// Validar variables de entorno antes de continuar
require('./config/env');

const express = require('express');
const cors = require('cors');
const path = require("path");
const config = require('./config/env');

const app = express();
const PORT = config.port;

// Configuración de CORS
const corsOptions = {
  origin: config.frontendUrl,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Primero: Middlewares globales
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Luego: Rutas
const productsRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const favoriteRoutes = require('./routes/favorite');
const purchaseHistoryRoutes = require('./routes/purchase-history');

app.use('/api/products', productsRoutes);
app.use('/api/users', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/purchase-history', purchaseHistoryRoutes);

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
