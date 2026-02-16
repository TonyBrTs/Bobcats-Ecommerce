/**
 * Configuración centralizada de URLs de la API
 * Las URLs se pueden configurar mediante variables de entorno
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const PAYMENT_API_URL = process.env.NEXT_PUBLIC_PAYMENT_API_URL || 'https://bobcats-api.onrender.com';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/users/login`,
    REGISTER: `${API_BASE_URL}/api/users/register`,
  },
  PRODUCTS: `${API_BASE_URL}/api/products`,
  CART: {
    UPDATE: `${API_BASE_URL}/api/cart/update-cart`,
    GET: `${API_BASE_URL}/api/cart/get-cart`,
  },
  FAVORITES: {
    UPDATE: `${API_BASE_URL}/api/favorite/update-favorites`,
    GET: `${API_BASE_URL}/api/favorite/get-favorites`,
  },
  PURCHASE_HISTORY: {
    ADD: `${API_BASE_URL}/api/purchase-history/add-purchase`,
    GET: `${API_BASE_URL}/api/purchase-history/get-purchase-history`,
  },
  PAYMENT: `${PAYMENT_API_URL}/api/payment`,
};

/**
 * Helper para construir URLs de imágenes estáticas
 */
export const getImageUrl = (path: string): string => {
  // Si la ruta ya es una URL completa, retornarla tal cual
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Si es una ruta relativa, construirla con el base URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

