'use client';

import { getCurrentUser } from '@/utils/auth';
import { getUserPurchaseHistory } from '@/utils/purchase-history';
import { useEffect, useState } from 'react';

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
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      const user = getCurrentUser();
      if (!user) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }

      try {
        const data = await getUserPurchaseHistory(user.username);
        setPurchases(data);
      } catch (e) {
        setError('Error al cargar el historial');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="p-8 text-text-secondary">Cargando historial...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (purchases.length === 0)
    return <p className="p-8 text-text-secondary">No hay compras registradas.</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-text-primary">
        Historial de Compras
      </h1>
      <div className="space-y-4">
        {purchases.map((purchase) => (
          <div
            key={purchase.purchaseId}
            className="border border-border-custom p-5 rounded-lg bg-surface-elevated shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-colors duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-text-muted">ID Compra</p>
                <p className="font-semibold text-text-primary">{purchase.purchaseId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-muted">Fecha</p>
                <p className="text-text-secondary">{new Date(purchase.date).toLocaleString()}</p>
              </div>
            </div>
            <div className="border-t border-border-custom pt-3 mt-3">
              <p className="text-sm font-medium text-text-secondary mb-2">Productos:</p>
              <ul className="space-y-1">
                {purchase.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm text-text-primary">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₡{item.price.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border-custom pt-3 mt-3 flex justify-between">
              <span className="font-bold text-text-primary">Total:</span>
              <span className="font-bold text-accent">₡{purchase.total.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
