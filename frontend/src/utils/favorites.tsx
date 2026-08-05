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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(API_ENDPOINTS.FAVORITES.UPDATE, {
    method: "POST",
    credentials: "include",
    headers,
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
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_ENDPOINTS.FAVORITES.GET}?username=${encodeURIComponent(username)}`, {
    credentials: "include",
    headers,
  });
  const data = await res.json();
  return data.favorites || [];
}
