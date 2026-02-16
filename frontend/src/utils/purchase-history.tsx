// ./utils/purchase-history.tsx
import { getCurrentUser, getAuthToken } from "./auth";
import { API_ENDPOINTS } from "@/config/api";

export async function addUserPurchase(purchase: any) {
  const user = getCurrentUser();
  if (!user) return;

  const token = getAuthToken();
  if (!token) {
    throw new Error('No autenticado');
  }

  const res = await fetch(API_ENDPOINTS.PURCHASE_HISTORY.ADD, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      username: user.username,
      purchase,
    }),
  });

  return res.json();
}

export async function getUserPurchaseHistory(username: string) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No autenticado');
  }

  const res = await fetch(`${API_ENDPOINTS.PURCHASE_HISTORY.GET}?username=${encodeURIComponent(username)}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await res.json();
  return data.purchases || [];
}
