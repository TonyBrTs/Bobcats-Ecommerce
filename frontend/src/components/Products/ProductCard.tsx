"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/types/Product";
import Image from "next/image";
import { Heart } from "lucide-react";
import { getCurrentUser } from "@/utils/auth";
import { getUserFavorites, updateUserFavorites } from "@/utils/favorites";

/**
 * ProductCard component for displaying product information in a card format.
 * @param product - The product to display in the card.
 * @returns
 */
export default function ProductCard(product: Product) {
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
    window.addEventListener("favoritesUpdated", handleFavoritesUpdated);
    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  async function toggleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
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
    window.dispatchEvent(new Event("favoritesUpdated"));
  }

  const hasDiscount =
    product.originalPrice !== undefined && product.originalPrice > product.price;

  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="group flex flex-col rounded-lg shadow-md overflow-hidden h-72 cursor-pointer hover:shadow-lg transition-shadow duration-300 ease-in-out relative">
      {/* Etiqueta de oferta */}
      {hasDiscount && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
          {discountPercentage}% off
        </div>
      )}

      {/* Corazón de favoritos solo si está logueado */}
      {getCurrentUser() && (
        <div className="absolute top-2 right-2 z-10">
          <button onClick={toggleFavorite} className="focus:outline-none">
            <Heart
              className={`w-6 h-6 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 cursor-pointer"
              }`}
            />
          </button>
        </div>
      )}

      {/* Imagen del producto */}
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="contain"
          className="w-full transition-transform duration-300 ease-in-out group-hover:scale-95"
          unoptimized
        />
      </div>

      {/* Información del producto */}
      <div className="p-2 flex flex-col justify-center h-1/2">
        <h2 className="text-base font-semibold leading-snug line-clamp-2">{product.name}</h2>
        <div className="mt-1">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-black">
                ₡{product.price.toLocaleString("es-CR", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-sm text-gray-400 line-through ml-2">
                ₡{product.originalPrice!.toLocaleString("es-CR", { minimumFractionDigits: 2 })}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-800">
              ₡{product.price.toLocaleString("es-CR", { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
