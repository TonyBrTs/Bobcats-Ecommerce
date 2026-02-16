"use client";
import { X, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

import { updateUserCart } from "@/utils/cart";

/**
 * Props for the CartDrawer component.
 */
type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
};

/**
 * CartDrawer component for displaying the shopping cart items.
 */
export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Close the drawer when the user clicks outside of it
  useEffect(() => {
    if (isOpen) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const cartWithQuantities = cart.map((item: CartItem) => ({
        ...item,
        quantity: item.quantity || 1,
      }));
      setCartItems(cartWithQuantities);
    }
  }, [isOpen]);

  //Updates cart state, localStorage, and dispatches cartUpdated event.
  async function updateCartState(updatedCart: CartItem[]) {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    await updateUserCart(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  }

  // Update cart items when the cart is updated
  function handleRemoveItem(index: number) {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    updateCartState(updatedCart);
  }
  function handleIncreaseQuantity(index: number) {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    updateCartState(updatedCart);
  }

  function handleDecreaseQuantity(index: number) {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      updateCartState(updatedCart);
    }
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
        } flex flex-col`}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            Productos agregados al carrito
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        {/* Lista de productos */}
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-13rem)]">
          {cartItems.length === 0 ? (
            <p className="text-sm text-gray-600">Carrito vacío por ahora...</p>
          ) : (
            <ul className="space-y-6">
              {cartItems.map((item, index) => (
                <li key={index} className="flex gap-4 border-b pb-4 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-contain rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold uppercase text-sm leading-tight">
                      {item.name}
                    </p>
                    <div className="text-sm mt-1 flex gap-4">
                      {item.selectedColor && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 font-medium">
                            Color:
                          </span>
                          <span
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: item.selectedColor }}
                          />
                        </div>
                      )}
                      {item.selectedSize && (
                        <span className="text-gray-600 text-sm">
                          <strong>Talla:</strong> {item.selectedSize}
                        </span>
                      )}
                    </div>
                    <p className="text-[#507D3B] font-semibold mt-1">
                      ₡{" "}
                      {(item.price * item.quantity).toLocaleString("es-CR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        className="w-6 h-6 text-center border rounded"
                        onClick={() => handleDecreaseQuantity(index)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="w-6 h-6 text-center border rounded"
                        onClick={() => handleIncreaseQuantity(index)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Subtotal y botones */}
        <div className="p-4 border-t bg-white">
          <div className="flex justify-between mb-3 text-base font-semibold">
            <span>Subtotal</span>
            <span>
              ₡{" "}
              {cartItems
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toLocaleString("es-CR", { minimumFractionDigits: 2 })}
            </span>
          </div>
            <Link href={cartItems.length > 0 ? "/checkout" : "#"}>
              <button
                disabled={cartItems.length === 0}
                className={`w-full font-bold py-2 rounded transition-colors ${
                  cartItems.length > 0
                    ? "bg-[#507D3B] text-white hover:bg-[#406b31]"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                onClick={onClose}
              >
                CONTINUAR CON EL PEDIDO
              </button>
            </Link>
        </div>
      </aside>
    </>
  );
}
