"use client";

import { useEffect, useState } from "react";
import { getUserPurchaseHistory } from "@/utils/purchase-history";
import { getCurrentUser } from "@/utils/auth";

type PurchaseItem = {
  name: string;
  quantity: number;
  price: number;
};

type Purchase = {
  purchaseId: string;
  date: string;
  items: PurchaseItem[];
  total: number;
};

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      const user = getCurrentUser();
      if (!user) {
        setError("Usuario no autenticado");
        setLoading(false);
        return;
      }

      try {
        const data = await getUserPurchaseHistory(user.username);
        setPurchases(data);
      } catch (e) {
        setError("Error al cargar el historial");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Cargando historial...</p>;
  if (error) return <p>{error}</p>;
  if (purchases.length === 0) return <p>No hay compras registradas.</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1 className="text-2xl font-bold mb-6 text-center">Historial de Compras</h1>
      {purchases.map((purchase) => (
        <div key={purchase.purchaseId} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <p><strong>ID Compra:</strong> {purchase.purchaseId}</p>
          <p><strong>Fecha:</strong> {new Date(purchase.date).toLocaleString()}</p>
          <p><strong>Total:</strong> ₡{purchase.total.toLocaleString()}</p>
          <h4>Productos:</h4>
          <ul>
            {purchase.items.map((item, idx) => (
              <li key={idx}>
                {item.name} — {item.quantity} × ₡{item.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
