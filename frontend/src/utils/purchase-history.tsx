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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(API_ENDPOINTS.PURCHASE_HISTORY.ADD, {
    method: "POST",
    credentials: "include",
    headers,
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
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_ENDPOINTS.PURCHASE_HISTORY.GET}?username=${encodeURIComponent(username)}`, {
    credentials: "include",
    headers,
  });
  const data = await res.json();
  return data.purchases || [];
}
