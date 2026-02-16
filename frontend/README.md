# Documentación del Proyecto

## Proyecto: **BOBCATS_DesarrolloWeb**

---

## 1. Descripción General

Este proyecto consiste en el desarrollo del frontend de un portal web de ecommerce especializado en productos de outdoor, hiking y aventura.  
Construido utilizando **Next.js, React, Tailwind CSS** y **TypeScript**.

El portal incluye:

- Página de inicio con carrusel de bienvenida.
- Secciones de productos organizadas por categorías.
- Funcionalidad de carrito de compras lateral.
- Sistema de login y registro de usuarios.
- Buscador de productos con animación.

---

## 2. Tecnologías utilizadas

- **Next.js** (estructura y ruteo del portal)
- **React** (componentes de interfaz)
- **TypeScript** (tipado seguro)
- **Tailwind CSS** (diseño responsivo basado en utilidades)
- **Keen Slider** (carrusel de imágenes)
- **Lucide React** (íconos)
- **Git + GitHub** (control de versiones y colaboración)

---

## 3. Estructura del proyecto

```
/public
/src
  /app
    /about-us
    /login
    /privacy-policy
    /productos
    /register
    /shipping-policy
    favicon.ico
    globals.css
    layout.tsx
    page.tsx
  /components
    /Carousel
    /Footer
    /Products
    CartDrawer.tsx
    Navbar.tsx
    SearchDrawer.tsx
  /data
    Products.json
  /types
.eslintrc.json
.gitignore
next-env.d.ts
next.config.ts
package.json
package-lock.json
postcss.config.mjs
README.md
tsconfig.json
```

---

## 4. Requisitos previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/) (con npm incluido)
- [Git](https://git-scm.com/)

---

## 5. Guía de instalación y uso

### 5.1 Clona el repositorio

```bash
git clone https://github.com/nathRodriguez/BOBCATS_DesarrolloWeb.git
```

---

### 5.2 Navega al directorio del proyecto

```bash
cd BOBCATS_DesarrolloWeb
```

---

### 5.3 Instala las dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias como Next.js, React, Tailwind CSS, TypeScript, Lucide React, etc.

---

### 5.4 Inicia el servidor de desarrollo

```bash
npm run dev
```

---

### 5.5 Accede a la aplicación

Abre tu navegador en:

```
http://localhost:3000
```

Aquí podrás ver el portal de ecommerce funcionando localmente.

---

## 6. Manual de uso funcional

- **Inicio de sesión:**  
  Accede a tu cuenta desde el icono de usuario o el menú.(Aún no tiene Funcionalidad Backend)

- **Registro de usuarios:**  
  Crea una cuenta completando el formulario de registro.(Aún no tiene Funcionalidad Backend)

- **Navegación de productos:**  
  Explora las diferentes categorías de productos.

- **Carrito de compras:**  
  Agrega productos y gestiona tu carrito desde el panel lateral.

- **Búsqueda de productos:**  
  Usa la lupa para desplegar el cuadro de búsqueda animado.

---

## 7. Recomendaciones para futuras mejoras

- Implementar un backend real (Firebase, Supabase, etc.).
- Añadir pasarela de pago (Stripe, PayPal).
- Mejorar validaciones en formularios.
- Proteger rutas privadas solo para usuarios autenticados.
- Mejorar la accesibilidad.
- Optimizar imágenes con `next/image`.
- Implementar multilenguaje (i18n).

---

# Fin de la Documentación
