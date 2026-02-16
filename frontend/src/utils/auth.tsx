import { jwtDecode } from "jwt-decode";

/**
 * Gets the current user from localStorage if the token is valid.
 * Returns the user object or null if not authenticated or token expired.
 */
export function getCurrentUser(): any | null {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (token && userData) {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        // Token expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return null;
      } else {
        const user = JSON.parse(userData);
        if (!user.username) {
          console.warn("[getCurrentUser] El usuario no tiene username:", user);
        }
        return user;
      }
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  }
  return null;
}