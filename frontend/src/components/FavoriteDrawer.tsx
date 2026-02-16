"use client";
import { X, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/utils/auth";
import { getUserFavorites, updateUserFavorites } from "@/utils/favorites";

type FavoriteItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

export default function FavoriteDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    async function fetchFavorites() {
      if (isOpen && user) {
        const favorites = await getUserFavorites(user.username);
        setFavoriteItems(favorites);
      }
    }
    fetchFavorites();
  }, [isOpen, user]);

  async function handleRemoveFavorite(index: number) {
    const updatedFavorites = [...favoriteItems];
    updatedFavorites.splice(index, 1);
    setFavoriteItems(updatedFavorites);

    await updateUserFavorites(updatedFavorites);
    window.dispatchEvent(new Event("favoritesUpdated"));
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 w-96 h-full bg-[#F1F5F2] z-50 shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Tus favoritos</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-4rem)]">
          {!user ? (
            <p className="text-sm text-gray-600">
              Debes iniciar sesión para ver tus favoritos.
            </p>
          ) : favoriteItems.length === 0 ? (
            <p className="text-sm text-gray-600">
              No tienes productos en favoritos todavía.
            </p>
          ) : (
            <ul className="space-y-6">
              {favoriteItems.map((item, index) => (
                <li key={index} className="flex gap-4 border-b pb-4 relative">
                  {/* Enlace a la página del producto */}
                  <Link
                    href={`/productos/productDetail/${item.id}`}
                    className="flex gap-4 w-full pr-10"
                  >
                    {/* Imagen */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-contain rounded"
                    />

                    {/* Info del producto */}
                    <div className="flex-1">
                      <p className="font-semibold uppercase text-sm leading-tight">
                        {item.name}
                      </p>
                      <p className="text-black font-medium mt-2">
                        ₡{" "}
                        {item.price.toLocaleString("es-CR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </Link>

                  {/* Botón para eliminar */}
                  <button
                    onClick={() => handleRemoveFavorite(index)}
                    className="absolute top-0 right-0 p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
