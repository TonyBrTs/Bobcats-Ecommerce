import { jwtDecode } from "jwt-decode";

/**
 * Gets the current user object stored in localStorage.
 * Token authentication is handled securely via HttpOnly cookies by the browser.
 * 
 * @returns The user profile object or null if not authenticated.
 */
export function getCurrentUser(): any | null {
  const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;

  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user;
    } catch (err) {
      console.error("Error parsing user profile:", err);
      return null;
    }
  }
  return null;
}

/**
 * Gets the authentication token from localStorage if present (legacy fallback).
 * 
 * @returns The token string or null.
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}