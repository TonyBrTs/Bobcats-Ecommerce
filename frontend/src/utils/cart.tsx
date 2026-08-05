import { getCurrentUser, getAuthToken } from "./auth";
import { API_ENDPOINTS } from "@/config/api";

/**
 * Updates the user's cart in the backend.
 * @param cart The cart array to save.
 * @returns Promise with the backend response.
 */
export async function updateUserCart(cart: any[]) {
  const user = getCurrentUser();
  if (!user) {
    return;
  }

  const username = user.username;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(API_ENDPOINTS.CART.UPDATE, {
    method: 'POST',
    credentials: 'include',
    headers,
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

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_ENDPOINTS.CART.GET}?username=${encodeURIComponent(username)}`, {
    credentials: 'include',
    headers,
  });
  const data = await res.json();
  return data.cart || [];
}