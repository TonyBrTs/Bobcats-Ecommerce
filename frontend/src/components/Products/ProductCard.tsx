'use client';

import type { Product } from '@/types/Product';
import { getCurrentUser } from '@/utils/auth';
import { getUserFavorites, updateUserFavorites } from '@/utils/favorites';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

/**
 * ProductCard component for displaying product information in a card format.
 * @param product - The product to display in the card.
 * @returns
 */
export default function ProductCard(product: Product & { badge?: string }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchFavorites() {
      const user = getCurrentUser();
      if (user) {
        const favs = await getUserFavorites(user.username);
        setFavorites(favs);
        setIsFavorite(favs.some((fav: Product) => fav.id === product.id));
      } else {
        setFavorites([]);
        setIsFavorite(false);
      }
    }
    fetchFavorites();

    const handleFavoritesUpdated = () => {
      fetchFavorites();
    };
    window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  async function toggleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;
    let updatedFavorites: Product[];
    if (isFavorite) {
      updatedFavorites = favorites.filter((fav: Product) => fav.id !== product.id);
    } else {
      updatedFavorites = [...favorites, product];
    }
    setFavorites(updatedFavorites);
    setIsFavorite(!isFavorite);
    await updateUserFavorites(updatedFavorites);
    window.dispatchEvent(new Event('favoritesUpdated'));
  }

  const hasDiscount = product.originalPrice !== undefined && product.originalPrice > product.price;

  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="group flex flex-col rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out relative bg-surface-elevated border border-border-custom overflow-hidden h-80 hover:-translate-y-1">
      {/* Etiqueta de oferta */}
      {hasDiscount && (
        <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md z-10 tracking-wide">
          -{discountPercentage}% OFF
        </div>
      )}

      {/* Badge opcional si no tiene descuento */}
      {!hasDiscount && product.badge && (
        <div className="absolute top-2.5 left-2.5 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md z-10 tracking-wide">
          {product.badge}
        </div>
      )}

      {/* Corazón de favoritos solo si está logueado */}
      {getCurrentUser() && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            onClick={toggleFavorite}
            aria-label="Guardar en favoritos"
            className="p-1.5 rounded-full bg-surface-elevated/85 backdrop-blur-md border border-border-custom/50 shadow-sm hover:scale-110 transition-transform focus:outline-none"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-text-muted hover:text-red-400'
              }`}
            />
          </button>
        </div>
      )}

      {/* Imagen del producto */}
      <div className="relative h-44 w-full p-3 bg-surface/40 dark:bg-black/15 overflow-hidden flex items-center justify-center">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          style={{ objectFit: 'contain' }}
          className="p-2 transition-transform duration-500 ease-out group-hover:scale-105"
          unoptimized
        />
      </div>

      {/* Información del producto */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          {product.subcategories && product.subcategories[0] && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-accent block mb-1">
              {product.subcategories[0]}
            </span>
          )}
          <h2 className="text-sm font-semibold leading-snug line-clamp-2 text-text-primary group-hover:text-accent transition-colors">
            {product.name}
          </h2>
        </div>
        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-text-primary">
                ₡{product.price.toLocaleString('es-CR')}
              </span>
              <span className="text-xs text-text-muted line-through">
                ₡{product.originalPrice!.toLocaleString('es-CR')}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-text-primary">
              ₡{product.price.toLocaleString('es-CR')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
