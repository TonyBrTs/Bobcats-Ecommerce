# 🚀 Mejoras Identificadas para el Proyecto BOBCATS

Este documento contiene un análisis completo de mejoras posibles para el proyecto, organizadas por categorías y prioridad.

---

## 🔴 CRÍTICAS (Seguridad y Funcionalidad)

### 1. **Seguridad - Autenticación JWT**
**Problema:** El token JWT expira en solo 5 minutos (`expiresIn: '5m'`), lo cual es demasiado corto para una sesión de usuario.

**Ubicación:** `backend/routes/auth.js:88`

**Solución:**
```javascript
// Cambiar de 5m a algo más razonable
const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '7d' })
```

**Mejora adicional:** Implementar refresh tokens para mejor seguridad.

---

### 2. **Seguridad - Middleware de Autenticación**
**Problema:** No hay middleware para proteger rutas que requieren autenticación. Cualquiera puede acceder a endpoints protegidos.

**Rutas afectadas:** `/api/cart/*`, `/api/favorite/*`, `/api/purchase-history/*`

**Solución:** Crear middleware `backend/middleware/auth.js`:
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
```

---

### 3. **Seguridad - Exposición de Errores**
**Problema:** Los errores de la base de datos se exponen directamente al cliente, lo que puede revelar información sensible.

**Ubicación:** Múltiples archivos en `backend/routes/`

**Ejemplo:** `backend/routes/auth.js:57`
```javascript
res.status(500).json({ message: 'Error en la base de datos', error });
```

**Solución:** No exponer el objeto `error` completo:
```javascript
res.status(500).json({ message: 'Error en la base de datos' });
// En desarrollo, puedes loguear el error completo
if (process.env.NODE_ENV === 'development') {
  console.error('Database error:', error);
}
```

---

### 4. **Configuración - URLs Hardcodeadas**
**Problema:** URLs de `localhost:3001` están hardcodeadas en múltiples archivos del frontend, dificultando el deployment y cambios de entorno.

**Archivos afectados:** 
- `frontend/src/app/login/page.tsx`
- `frontend/src/app/register/page.tsx`
- `frontend/src/utils/*.tsx`
- `frontend/src/components/*.tsx`
- Y más...

**Solución:** Crear archivo de configuración `frontend/src/config/api.ts`:
```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/users`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  CART: `${API_BASE_URL}/api/cart`,
  FAVORITES: `${API_BASE_URL}/api/favorite`,
  PURCHASE_HISTORY: `${API_BASE_URL}/api/purchase-history`,
};
```

Y crear `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### 5. **Seguridad - CORS Sin Restricciones**
**Problema:** CORS está configurado sin restricciones, permitiendo cualquier origen.

**Ubicación:** `backend/server.js:10`

**Solución:**
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

---

### 6. **Validación - Variables de Entorno**
**Problema:** No hay validación de variables de entorno requeridas al iniciar el servidor.

**Solución:** Crear `backend/config/env.js`:
```javascript
require('dotenv').config();

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

module.exports = {
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
};
```

---

## 🟡 IMPORTANTES (Código y Arquitectura)

### 7. **Arquitectura - Manejo Centralizado de Errores**
**Problema:** El manejo de errores está duplicado en cada ruta.

**Solución:** Crear middleware de manejo de errores `backend/middleware/errorHandler.js`:
```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'No autorizado' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

Usar en `server.js`:
```javascript
const errorHandler = require('./middleware/errorHandler');
// ... después de todas las rutas
app.use(errorHandler);
```

---

### 8. **Código - Validación Centralizada**
**Problema:** Validaciones de email, username, password están duplicadas.

**Solución:** Crear `backend/utils/validators.js`:
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z_ áéíóúÁÉÍÓÚñÑ]{3,50}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d _\-!@#$%^&*(),.?":{}|<>]{8,}$/;

exports.validateEmail = (email) => {
  if (!email) return { valid: false, message: 'Email es obligatorio' };
  if (!emailRegex.test(email)) return { valid: false, message: 'Email inválido' };
  return { valid: true };
};

exports.validateUsername = (username) => {
  if (!username) return { valid: false, message: 'Username es obligatorio' };
  if (!usernameRegex.test(username)) {
    return { valid: false, message: 'Username inválido. Debe tener entre 3 y 50 caracteres' };
  }
  return { valid: true };
};

exports.validatePassword = (password) => {
  if (!password) return { valid: false, message: 'Password es obligatorio' };
  if (!passwordRegex.test(password)) {
    return { valid: false, message: 'Password debe tener al menos 8 caracteres, una letra y un número' };
  }
  return { valid: true };
};
```

---

### 9. **Código - Rate Limiting**
**Problema:** No hay protección contra ataques de fuerza bruta o abuso de API.

**Solución:** Instalar `express-rate-limit`:
```bash
npm install express-rate-limit
```

En `server.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Demasiados intentos, intenta más tarde'
});

app.use('/api/', limiter);

// Límite más estricto para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de login, intenta más tarde'
});

app.use('/api/users/login', loginLimiter);
```

---

### 10. **Código - Logging Estructurado**
**Problema:** Uso de `console.log` básico sin estructura.

**Solución:** Usar `winston` o `pino`:
```bash
npm install winston
```

Crear `backend/utils/logger.js`:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

---

### 11. **Arquitectura - Separación de Lógica de Negocio**
**Problema:** La lógica de negocio está mezclada con las rutas.

**Solución:** Crear capa de servicios:
- `backend/services/userService.js`
- `backend/services/productService.js`
- `backend/services/cartService.js`

Ejemplo `backend/services/userService.js`:
```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const clientPromise = require('../services/mongodb');

class UserService {
  async registerUser(username, email, password) {
    const client = await clientPromise;
    const db = client.db('BobcatsDB');
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new Error('El usuario o correo electrónico ya existe');
    }

    const lastUser = await usersCollection.find().sort({ id: -1 }).limit(1).toArray();
    const newUserId = lastUser.length > 0 ? lastUser[0].id + 1 : 1;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: newUserId,
      username,
      email,
      password: hashedPassword,
    };

    await usersCollection.insertOne(newUser);
    return { id: newUserId, username, email };
  }

  async loginUser(email, password) {
    const client = await clientPromise;
    const db = client.db('BobcatsDB');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: { id: user.id, username: user.username, email: user.email }
    };
  }
}

module.exports = new UserService();
```

---

## 🟢 MEJORAS (UX y Performance)

### 12. **UX - Navegación con Next.js Router**
**Problema:** Uso de `window.location.href` y `window.location.reload()` en lugar del router de Next.js.

**Archivos afectados:**
- `frontend/src/components/Navbar.tsx:224`
- `frontend/src/components/UserMenu.tsx:36`
- `frontend/src/app/login/page.tsx:68`
- `frontend/src/app/register/page.tsx:65`

**Solución:** Usar `useRouter` de Next.js:
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
// En lugar de window.location.href = '/'
router.push('/');
// En lugar de window.location.reload()
router.refresh();
```

---

### 13. **Performance - Optimización de Imágenes**
**Problema:** Imágenes servidas desde `localhost:3001` en lugar de usar Next.js Image optimization.

**Archivos afectados:**
- `frontend/src/app/page.tsx`
- `frontend/src/components/Carousel/HeroCarousel.tsx`
- `frontend/src/components/Navbar.tsx`

**Solución:** 
1. Mover imágenes a `frontend/public/`
2. Usar componente `Image` de Next.js con rutas relativas:
```typescript
import Image from 'next/image';

<Image
  src="/Carousel/Equipment.png"
  alt="Aventura"
  width={240}
  height={240}
  quality={100}
/>
```

---

### 14. **Performance - Conexión MongoDB en Producción**
**Problema:** En producción se crea una nueva conexión por cada request.

**Ubicación:** `backend/services/mongodb.js:19-22`

**Solución:** Usar singleton pattern también en producción:
```javascript
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {});
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // En producción también usar singleton
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}
```

---

### 15. **UX - Manejo de Errores en Frontend**
**Problema:** Uso de `alert()` nativo en lugar de componentes de UI.

**Ubicación:** `frontend/src/app/login/page.tsx:84`

**Solución:** Ya tienen componente Toast, usarlo consistentemente:
```typescript
// En lugar de alert("Error de red");
setToastType("error");
setToastMessage("Error de conexión. Por favor intenta más tarde.");
setShowToast(true);
```

---

### 16. **Código - TypeScript Types**
**Problema:** Uso de `any` en algunos lugares.

**Ubicación:** `frontend/src/utils/auth.tsx:7`

**Solución:** Crear tipos apropiados:
```typescript
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface DecodedToken {
  id: number;
  email: string;
  exp: number;
  iat: number;
}

export function getCurrentUser(): User | null {
  // ...
  const decoded: DecodedToken = jwtDecode(token);
  // ...
}
```

---

### 17. **Código - Variables de Entorno para Frontend**
**Problema:** URLs y configuraciones hardcodeadas.

**Solución:** Crear `frontend/.env.local.example`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_PAYMENT_API_URL=https://bobcats-api.onrender.com
```

Y usar en código:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

---

### 18. **Testing - Falta de Tests**
**Problema:** No hay tests unitarios ni de integración.

**Solución:** Agregar Jest y Supertest:
```bash
npm install --save-dev jest supertest @types/jest
```

Crear tests básicos:
- `backend/__tests__/auth.test.js`
- `backend/__tests__/products.test.js`

---

### 19. **Documentación - API Documentation**
**Problema:** No hay documentación de la API.

**Solución:** Agregar Swagger/OpenAPI:
```bash
npm install swagger-ui-express swagger-jsdoc
```

---

### 20. **Código - Eliminar Código Comentado**
**Problema:** Código comentado en varios archivos.

**Ejemplo:** `frontend/src/app/login/page.tsx:70,72`

**Solución:** Eliminar código comentado o moverlo a documentación.

---

## 📋 Resumen de Prioridades

### 🔴 Alta Prioridad (Implementar primero)
1. Middleware de autenticación
2. Variables de entorno y configuración centralizada
3. Manejo seguro de errores
4. URLs configurables

### 🟡 Media Prioridad (Mejoras importantes)
5. Validación centralizada
6. Rate limiting
7. Logging estructurado
8. Separación de lógica de negocio

### 🟢 Baja Prioridad (Mejoras incrementales)
9. Optimización de imágenes
10. Navegación con router
11. Types TypeScript completos
12. Tests

---

## 🛠️ Plan de Implementación Sugerido

### Fase 1: Seguridad (Semana 1)
- [ ] Middleware de autenticación
- [ ] Variables de entorno validadas
- [ ] CORS configurado correctamente
- [ ] Rate limiting básico

### Fase 2: Arquitectura (Semana 2)
- [ ] Manejo centralizado de errores
- [ ] Validación centralizada
- [ ] Separación de servicios
- [ ] Logging estructurado

### Fase 3: Frontend (Semana 3)
- [ ] Configuración de URLs
- [ ] Optimización de imágenes
- [ ] Mejoras de navegación
- [ ] Types TypeScript completos

### Fase 4: Testing y Documentación (Semana 4)
- [ ] Tests básicos
- [ ] Documentación de API
- [ ] README actualizado

---

**Nota:** Este documento puede ser actualizado conforme se implementen las mejoras o se identifiquen nuevas áreas de mejora.

