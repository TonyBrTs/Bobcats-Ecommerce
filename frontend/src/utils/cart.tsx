import { getCurrentUser } from "./auth";

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
  const res = await fetch('http://localhost:3001/api/cart/update-cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  const res = await fetch(`http://localhost:3001/api/cart/get-cart?username=${encodeURIComponent(username)}`);
  const data = await res.json();
  return data.cart || [];
}