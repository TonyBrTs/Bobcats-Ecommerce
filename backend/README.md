# Documentación del Proyecto

## Proyecto: **BOBCATS_Backend**

---

## 1. Descripción General

Este proyecto representa la API del sistema **BOBCATS**, encargada de gestionar la autenticación de usuarios, productos, sesiones y lógica básica de backend para el portal de ecommerce.

Está construido con **Node.js** y **Express**, utilizando archivos `.json` para persistencia de datos, ideal para entornos de desarrollo o pruebas locales.

---

## 2. Tecnologías utilizadas

- **Node.js** – Entorno de ejecución JavaScript del lado del servidor.
- **Express.js** – Framework para construir APIs RESTful.
- **dotenv** – Carga de variables de entorno.
- **bcrypt** – Encriptación de contraseñas.
- **cors** – Permitir acceso al frontend.
- **cookie-parser** – Manejo de cookies.
- **uuid** – Generación de identificadores únicos.
- **Git + GitHub** – Control de versiones.

---

## 3. Estructura del proyecto

```plaintext
/backend
├── data/                -> Archivos JSON con usuarios y otros recursos
├── node_modules/        -> Dependencias instaladas por npm
├── public/              -> Archivos estáticos
├── routes/              -> Rutas del API (usuarios, autenticación, etc.)
├── .env                 -> Variables de entorno (secretos, puertos, etc.)
├── package.json         -> Dependencias y scripts
├── package-lock.json    -> Control de versiones de dependencias
├── server.js            -> Punto de entrada principal del backend
├── test-hash.js         -> Script para generar hash de contraseñas
└── README.md            -> Este archivo
```

---

## 4. Requisitos previos

Asegúrate de tener instalados:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)

---

## 5. Guía de instalación y uso

### 5.1 Clona el repositorio

```bash
git clone https://github.com/nathRodriguez/BOBCATS_DesarrolloWeb.git
```

---

### 5.2 Navega al directorio del backend

```bash
cd BOBCATS_DesarrolloWeb/backend
```

---

### 5.3 Instala las dependencias

```bash
npm install
```

---


### 5.4 Inicia el servidor

```bash
node server.js
```

---

### 5.5 Accede al backend

Abre tu navegador o cliente como Postman en:

```
http://localhost:3001
```

---

## 6. Funcionalidades

- 🔐 Registro e inicio de sesión de usuarios
- 🍪 Autenticación con cookies y JWT
- 📁 Lectura de datos desde archivos `.json`
- 🔄 Validación de rutas protegidas
- 📦 Manejo de productos 
---

## 7. Rutas principales

- `POST /api/register` → Registro de usuario
- `POST /api/login` → Inicio de sesión
- `GET /api/logout` → Cierre de sesión
- `GET /api/user` → Verificación de usuario autenticado

(Más rutas disponibles dentro del archivo `routes/`)

---

## 8. Mejoras futuras sugeridas

- Conexión con una base de datos real (MongoDB, PostgreSQL, etc.).
- Implementación de control de sesiones más avanzado.
- Manejo de errores y logs con herramientas como Winston.
- Validación de esquemas con Joi o Zod.
- Refactorización a TypeScript.

---

# Fin de la Documentación
