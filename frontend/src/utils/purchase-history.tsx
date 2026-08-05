/**
 * @file utils/purchase-history.tsx
 * @description Utility functions to register and retrieve user purchase records from the backend API.
 */

import { getCurrentUser, getAuthToken } from "./auth";
import { API_ENDPOINTS } from "@/config/api";

/**
 * Adds a new completed purchase to the current user's purchase history.
 * 
 * @param purchase - Purchase details payload.
 * @returns Promise with backend JSON response.
 */
export async function addUserPurchase(purchase: any) {
  const user = getCurrentUser();
  if (!user) return;

  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
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

/**
 * Retrieves the purchase history array for a given user.
 * 
 * @param username - Target account username.
 * @returns Promise with purchases list.
 */
export async function getUserPurchaseHistory(username: string) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const res = await fetch(`${API_ENDPOINTS.PURCHASE_HISTORY.GET}?username=${encodeURIComponent(username)}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await res.json();
  return data.purchases || [];
}
