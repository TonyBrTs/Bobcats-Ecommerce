// ./utils/favorites.tsx
import { getCurrentUser, getAuthToken } from "./auth";
import { API_ENDPOINTS } from "@/config/api";

/**
 * Updates the user's favorites in the backend.
 * @param favorites The favorites array to save.
 * @returns Promise with the backend response.
 */
export async function updateUserFavorites(favorites: any[]) {
  const user = getCurrentUser();
  if (!user) return;

  const token = getAuthToken();
  if (!token) {
    throw new Error('No autenticado');
  }

  const res = await fetch(API_ENDPOINTS.FAVORITES.UPDATE, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      username: user.username,
      favorites,
    }),
  });

  return res.json();
}

/**
 * Gets the user's favorites from the backend.
 * @param username The username of the user.
 * @returns Promise with the favorites array.
 */
export async function getUserFavorites(username: string) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No autenticado');
  }

  const res = await fetch(`${API_ENDPOINTS.FAVORITES.GET}?username=${encodeURIComponent(username)}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await res.json();
  return data.favorites || [];
}
