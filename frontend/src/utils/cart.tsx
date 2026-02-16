import { getCurrentUser, getAuthToken } from "./auth";
import { API_ENDPOINTS } from "@/config/api";

/**
 * Updates the user's cart in the backend.
 * @param cart The cart array to save.
 * @returns Promise with the backend response.
 */
export async function updateUserCart(cart: any[]) {
  const user = getCurrentUser();
  let username = '';
  if (!user) {
    return;
  }

  username = user.username
  const token = getAuthToken();
  if (!token) {
    throw new Error('No autenticado');
  }

  const res = await fetch(API_ENDPOINTS.CART.UPDATE, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ username, cart }),
  });
  return res.json();
}

/**
 * Gets the user's cart from the backend.
 * @param username The username of the user.
 * @returns Promise with the cart array.
 */
export async function getUserCart(username: string) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No autenticado');
  }

  const res = await fetch(`${API_ENDPOINTS.CART.GET}?username=${encodeURIComponent(username)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await res.json();
  return data.cart || [];
}