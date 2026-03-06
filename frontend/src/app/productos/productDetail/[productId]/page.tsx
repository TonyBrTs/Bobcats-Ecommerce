'use client';

import { API_ENDPOINTS } from '@/config/api';
import type { Product } from '@/types/Product';
import { getCurrentUser } from '@/utils/auth';
import { updateUserCart } from '@/utils/cart';
import { getUserFavorites, updateUserFavorites } from '@/utils/favorites';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [toastType, setToastType] = useState<'success' | 'warning' | 'error' | null>(null);

  async function handleAddToCart(product: Product) {
    const user = await getCurrentUser();
    if (!user) {
      setToastType('error');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setToastType(null);
      }, 3000);
      return;
    }

    if (!selectedColor || !selectedSize) {
      setToastType('warning');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setToastType(null);
      }, 3000);
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const alreadyInCart = cart.some((item: Product) => item.id === product.id);

    if (alreadyInCart) {
      setToastType('warning');
    } else {
      cart.push({
        ...product,
        selectedColor,
        selectedSize,
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      setToastType('success');
      await updateUserCart(cart);
      window.dispatchEvent(new Event('cartUpdated'));
    }

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastType(null);
    }, 3000);
  }

  async function toggleFavorite() {
    const user = getCurrentUser();
    if (!user || !product) return;
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

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const id = Array.isArray(productId) ? productId[0] : productId;
        const res = await fetch(API_ENDPOINTS.PRODUCTS);
        const data: Product[] = await res.json();

        const found = data.find((p) => p.id === parseInt(id));
        setProduct(found || null);
        setImageUrl(found?.imageUrl || null);
      } catch (error) {
        console.error('Error al obtener producto:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    async function fetchFavorites() {
      const user = getCurrentUser();
      if (user && product) {
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
  }, [product?.id]);

  useEffect(() => {
    if (showToast) {
      console.log('Sonido');
      const audio = new Audio('/Sounds/success.wav');
      audio.volume = 0.5; // volumen opcional
      audio.play().catch(() => {});
    }
  }, [showToast]);

  useEffect(() => {
    if (product && selectedColor) {
      const newImage = product.colorImages?.[selectedColor];
      setImageUrl(newImage || product.imageUrl);
    }
  }, [selectedColor, product]);

  if (isLoading) return <div className="text-center">Cargando...</div>;
  if (!product) return <div className="text-center">Producto no encontrado</div>;

  const hasDiscount = product.originalPrice !== undefined && product.originalPrice > product.price;

  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-10 px-4">
      <div className="relative w-full md:w-1/3 h-96 overflow-hidden">
        {/* Corazón de favoritos solo si está logueado */}
        {getCurrentUser() && (
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 z-10 focus:outline-none"
          >
            <Heart
              className={`w-8 h-8 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>
        )}

        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
            {discountPercentage}% off
          </div>
        )}

        <Image
          src={imageUrl || product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="contain"
          className="w-full"
          unoptimized
        />
      </div>

      <div className="bg-surface p-6 rounded-lg shadow-md dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] w-full md:w-1/2 border border-transparent dark:border-border-custom transition-colors duration-300">
        <h1 className="text-2xl font-bold text-text-primary">{product.name}</h1>
        <p className="mt-4 text-xl text-text-primary">
          ₡{' '}
          {product.price.toLocaleString('es-CR', {
            minimumFractionDigits: 2,
          })}
          {hasDiscount && (
            <span className="text-sm text-text-muted line-through ms-2">
              ₡{' '}
              {product.originalPrice!.toLocaleString('es-CR', {
                minimumFractionDigits: 2,
              })}
            </span>
          )}
        </p>

        {product.colors && product.colors?.length > 0 && (
          <div className="mt-4">
            <p className="font-medium text-lg text-text-primary">Colores:</p>
            <div className="flex items-center space-x-2 mt-2">
              {product.colors.map((color, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                    selectedColor === color
                      ? 'border-text-primary scale-110'
                      : 'border-border-custom hover:border-text-primary hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {product.sizes && product.sizes?.length > 0 && (
          <div className="mt-4">
            <p className="font-medium text-lg text-text-primary">Tallas:</p>
            <div className="flex items-center space-x-2 mt-2">
              {product.sizes.map((size, idx) => (
                <span
                  key={idx}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 border border-border-custom rounded text-sm cursor-pointer transition-all duration-200 ${
                    selectedSize === size
                      ? 'bg-text-primary text-background'
                      : 'text-text-primary hover:bg-text-primary hover:text-background'
                  }`}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="mt-4 text-lg text-text-secondary">{product.description}</p>

        <button
          onClick={() => handleAddToCart(product)}
          className="mt-6 px-6 py-2 bg-surface-elevated text-text-primary border border-border-custom rounded-lg hover:bg-surface transition duration-200"
        >
          Agregar al carrito
        </button>
      </div>

      {/* Toast éxito */}
      <div
        role="alert"
        className={`fixed top-5 left-1/2 z-50 transform transition-all duration-300 ease-out
          ${
            showToast && toastType === 'success'
              ? '-translate-x-1/2 translate-y-0 opacity-100'
              : '-translate-x-1/2 -translate-y-10 opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex items-center w-full max-w-sm p-4 mb-4 text-[#2C2C2C] bg-[#F1F5F2] border border-[#D4E4D1] rounded-lg shadow-lg text-base">
          <div className="inline-flex items-center justify-center w-8 h-8 text-[#507D38] bg-[#E1F1DC] rounded-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
          </div>
          <div className="ms-3 font-medium">
            <span className="font-semibold">{product.name}</span> fue agregado al carrito.
          </div>
        </div>
      </div>

      {/* Toast advertencia */}
      <div
        role="alert"
        className={`fixed top-5 left-1/2 z-50 transform transition-all duration-300 ease-out
          ${
            showToast && toastType === 'warning'
              ? '-translate-x-1/2 translate-y-0 opacity-100'
              : '-translate-x-1/2 -translate-y-10 opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex items-center w-full max-w-sm p-4 mb-4 text-yellow-900 bg-yellow-100 border border-yellow-300 rounded-lg shadow-lg text-base">
          <div className="inline-flex items-center justify-center w-8 h-8 text-yellow-500 bg-yellow-200 rounded-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
            </svg>
          </div>
          <div className="ms-3 font-medium">
            {selectedColor && selectedSize
              ? 'Este producto ya está en el carrito.'
              : 'Debes seleccionar un color y una talla antes de agregar al carrito.'}
          </div>
        </div>
      </div>

      {/* Toast error (usuario no logueado) */}
      <div
        role="alert"
        className={`fixed top-5 left-1/2 z-50 transform transition-all duration-300 ease-out
          ${
            showToast && toastType === 'error'
              ? '-translate-x-1/2 translate-y-0 opacity-100'
              : '-translate-x-1/2 -translate-y-10 opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex items-center w-full max-w-sm p-4 mb-4 text-[#B91C1C] bg-[#FEE2E2] border border-[#FCA5A5] rounded-lg shadow-lg text-base">
          <div className="inline-flex items-center justify-center w-8 h-8 text-[#B91C1C] bg-[#FCA5A5] rounded-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1-8a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1Z" />
            </svg>
          </div>
          <div className="ms-3 font-medium">
            Debes iniciar sesión para agregar productos al carrito.
          </div>
        </div>
      </div>
    </div>
  );
}
