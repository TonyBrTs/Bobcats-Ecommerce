# 🏔️ Bobcats Ecommerce - Portal de Aventura

Bienvenido a la documentación oficial del proyecto **Bobcats Ecommerce**. Esta plataforma es un comercio electrónico moderno, responsivo y de alto rendimiento especializado en equipamiento outdoor, ropa técnica y accesorios para aventuras al aire libre.

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura monorepo organizada en microservicios y capas bien definidas:

- **Frontend (`/frontend`)**: Aplicación web desarrollada con **Next.js (App Router)** y **TypeScript**.
- **Backend Principal (`/backend`)**: API RESTful construida con **Node.js** y **Express**, responsable del catálogo de productos, autenticación de usuarios, carrito de compras y favoritos.
- **Base de Datos**: **MongoDB Atlas** para persistencia distribuida y escalable.
- **Payment API (`/payment-api`)**: Microservicio independiente especializado en el procesamiento de pagos.

```
Bobcats-Ecommerce/
├── frontend/             # Aplicación Next.js 16 (App Router)
│   ├── src/app/          # Páginas (Inicio, Catálogo, Detalle, Checkout, Perfil)
│   ├── src/components/   # Componentes UI (Navbar, CartDrawer, ThemeToggle, etc.)
│   ├── src/config/       # Configuración centralizada de APIs y URLs
│   ├── src/context/      # Contextos globales (ThemeContext)
│   └── src/types/        # Definiciones de tipos TypeScript
├── backend/              # API Node.js / Express
│   ├── config/           # Validación de variables de entorno (env.js)
│   ├── middleware/       # Rate limiting, Auth JWT y manejo de errores
│   ├── routes/           # Endpoints API (products, auth, cart, favorite, etc.)
│   ├── services/         # Conexión a MongoDB (mongodb.js)
│   └── utils/            # Sistema de logging con Winston
├── payment-api/          # Microservicio de Pagos
└── README.md             # Documentación principal
```

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Framework**: Next.js 16 (App Router / Turbopack)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS (con variables de tema HSL y modo oscuro dinámico)
- **Iconografía**: Lucide React
- **Gestión de Estado y Contexto**: React Context API & LocalStorage

### Backend & Seguridad
- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: MongoDB (Driver Oficial + MongoDB Atlas)
- **Seguridad**:
  - Hashing de contraseñas con `bcryptjs`.
  - Autenticación mediante JSON Web Tokens (`JWT`).
  - Protección de endpoints con `express-rate-limit`.
  - Configuración dinámica de políticas `CORS`.
- **Logger**: Logging estructurado con `winston`.

---

## 🔧 Configuración de Entornos (Local vs Producción)

El proyecto soporta configuración transparente según el entorno:

- **Desarrollo Local**: 
  - El frontend utiliza `frontend/.env.local` configurado apuntando a `http://localhost:3001`.
  - El backend se ejecuta localmente en el puerto `3001` permitiendo peticiones desde `http://localhost:3000`.
- **Producción**:
  - El frontend utiliza `frontend/.env.production` configurado apuntando a la API en Render (`https://bobcats-ecommerce.onrender.com`).

---

## 🚀 Guía de Instalación y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/nathRodriguez/BOBCATS_DesarrolloWeb.git
cd Bobcats-Ecommerce
```

### 2. Iniciar el Backend
```bash
cd backend
npm install
npm run dev
# Servidor escuchando en http://localhost:3001
```

### 3. Iniciar el Frontend
```bash
cd frontend
npm install
npm run dev
# Disponible en http://localhost:3000
```

---

## ✨ Funcionalidades Destacadas

1. **Modo Claro / Oscuro Inteligente**: Soporte completo para temas de color sin errores de *Hydration Mismatch* en SSR.
2. **Navegación Fluida**: Menús desplegables y paneles laterales (*Drawers*) que se pliegan automáticamente al interactuar o hacer clic en cualquier opción.
3. **Selección Condicional de Opciones**: Ajuste dinámico en el detalle del producto; solo exige seleccionar talla y/o color según la disponibilidad del ítem (ej. ropa solicita talla y color; botellas o bolsos solo solicitan color).
4. **Página de Inicio Dinámica**: Secciones dedicadas a categorías principales (Hombre, Mujer, Accesorios), propuestas de valor y llamada a la acción.
5. **Estado de Carga (Loading Spinner)**: Pantalla de carga visualmente atractiva al consultar productos del catálogo.

---

## 📜 Licencia y Autores

Desarrollado para **Bobcats Ecommerce**. Todos los derechos reservados.
