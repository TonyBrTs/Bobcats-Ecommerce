'use client';

import { API_ENDPOINTS } from '@/config/api';
import type { Product } from '@/types/Product';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type SearchDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchDrawer({ isOpen, onClose }: SearchDrawerProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const router = useRouter();

  //  Evita scroll cuando se abre
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  //  Cargar productos solo una vez al abrir
  useEffect(() => {
    if (isOpen && allProducts.length === 0) {
      fetch(API_ENDPOINTS.PRODUCTS)
        .then((res) => res.json())
        .then((data) => setAllProducts(data))
        .catch((err) => console.error('Error al cargar productos:', err));
    }
  }, [isOpen]);

  //  Filtrar productos
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts([]);
      return;
    }

    const results = allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setFilteredProducts(results);
  }, [searchQuery, allProducts]);

  if (!isOpen) return null;

  function handleProductClick(product: Product) {
    router.push(`/productos/productDetail/${product.id}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pt-6">
      <div className="absolute inset-0 bg-transparent cursor-pointer" onClick={onClose} />
      <div className="relative bg-surface-elevated rounded-md shadow-md dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] w-[90%] max-w-2xl p-4 flex flex-col gap-4 z-10 border border-transparent dark:border-border-custom transition-colors duration-300">
        <div className="flex items-center gap-2">
          <input
            autoFocus
            type="text"
            placeholder="Buscar producto..."
            className="flex-grow p-2 border border-input-border rounded-md bg-input-bg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            ✖
          </button>
        </div>

        {filteredProducts.length > 0 && (
          <ul className="max-h-[400px] overflow-y-auto">
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                className="flex items-center gap-2 p-2 border-b border-border-custom cursor-pointer hover:bg-surface transition"
                onClick={() => handleProductClick(product)}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <h4 className="font-semibold text-text-primary">{product.name}</h4>
                  <p className="text-text-muted text-sm">{product.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-accent font-medium">
                      ₡{product.price.toLocaleString('es-CR')}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-red-600 dark:text-red-400 font-semibold text-sm">
                        -
                        {Math.round(
                          ((product.originalPrice - product.price) / product.originalPrice) * 100,
                        )}
                        % off
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
