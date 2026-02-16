// ./utils/favorites.tsx
import { getCurrentUser } from "./auth";

export async function addUserPurchase(purchase: any) {
  const user = getCurrentUser();
  if (!user) return;

  const res = await fetch("http://localhost:3001/api/purchase-history/add-purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user.username,
      purchase,
    }),
  });

  return res.json();
}

export async function getUserPurchaseHistory(username: string) {
  const res = await fetch(`http://localhost:3001/api/purchase-history/get-purchase-history?username=${encodeURIComponent(username)}`);
  const data = await res.json();
  return data.purchases || [];
}
