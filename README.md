# 🏔️ Bobcats Ecommerce - Adventure Portal

Welcome to the official repository for **Bobcats Ecommerce**! This project is a modern, premium, and highly functional e-commerce portal specializing in adventure, hiking, and outdoor gear.

---

## 🏗️ System Architecture

The project follows a simplified microservices architecture based on a monorepo that effectively separates frontend and backend concerns:

- **Frontend (`/frontend`)**: Dynamic user interface built with **Next.js 15**.
- **Backend (`/backend`)**: Main API for user management, products, and authentication with **Node.js/Express**.
- **Database**: **MongoDB** implementation for scalable data persistence.
- **Payment API (`/payment-api`)**: Dedicated microservice for processing payments and transactions.

---

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0 (Modern Aesthetics)
- **Components**: React (Hooks)
- **Iconography**: Lucide React
- **Interactivity**: Keen Slider
- **Theming**: Native Dark Mode support with smooth transitions.

### Backend & API

- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Environment-optimized connectivity)
- **Authentication**: JWT + Cookies (HttpOnly for enhanced XSS security)
- **Security**:
  - Password hashing with `bcryptjs`.
  - Integrated Rate Limiting to prevent brute force attacks.
- **Logging**: Professional logging system with `winston`.

---

## 🚀 Installation and Usage Guide

### 1. Clone the repository

```bash
git clone https://github.com/nathRodriguez/BOBCATS_DesarrolloWeb.git
cd Bobcats-Ecommerce
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
# Access at http://localhost:3000
```

### 3. Start the Backend

```bash
cd backend
npm install
npm run dev # Uses nodemon for development
# Runs at http://localhost:3001
```

### 4. Start the Payment API

```bash
cd payment-api
npm install
npm run dev
# Runs at http://localhost:3002 (or configured port)
```

---

## 📁 Project Structure

```plaintext
Bobcats-Ecommerce/
├── frontend/             # Next.js 15 Interface
│   ├── src/app/          # Pages (Home, Products, Checkout, etc.)
│   ├── src/components/   # UI Components (Navbar, CartDrawer, etc.)
│   └── public/           # Static assets
├── backend/              # Main API (Authentication & Products with MongoDB)
├── payment-api/          # Payment Microservice
└── README.md             # Main Documentation
```

---

## ✨ Featured Features

- **Advanced Security**: Secure cookie implementation and rate limiting to protect the API.
- **Robust Persistence**: Use of MongoDB for efficient data management.
- **Interactivity**: Side menus (Drawers) for cart and search.
- **Responsive**: Optimized design for mobile and desktop.
- **User Experience**: Fluid transitions and animations with Lucide and Tailwind.
- **Purchase History**: Dedicated purchase record per user.

---

## 🔮 Roadmap

- [ ] Cloud deployment (Vercel / Render / Atlas).
- [ ] Real payment support with Stripe.
- [ ] Comprehensive multi-language support (i18n).
- [ ] Advanced SEO optimization.

---

# End of Documentation
