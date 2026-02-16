"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getCurrentUser } from "@/utils/auth";
import { useCheckoutValidation } from "@/hooks/useCheckoutValidation";
import Toast from "@/components/Toast";
import { updateUserCart } from "@/utils/cart";
import { addUserPurchase } from "@/utils/purchase-history";
import { useRouter } from "next/navigation";

const provinciasYCantones: { [key: string]: string[] } = {
  "San José": [
    "San José",
    "Escazú",
    "Desamparados",
    "Aserrí",
    "Mora",
    "Goicoechea",
    "Santa Ana",
    "Alajuelita",
    "Vásquez de Coronado",
    "Acosta",
    "Tibás",
    "Moravia",
    "Montes de Oca",
    "Turrubares",
    "Dota",
    "Curridabat",
    "Pérez Zeledón",
    "León Cortés",
  ],
  Alajuela: [
    "Alajuela",
    "San Ramón",
    "Grecia",
    "San Mateo",
    "Atenas",
    "Naranjo",
    "Palmares",
    "Poás",
    "Orotina",
    "San Carlos",
    "Zarcero",
    "Valverde Vega",
    "Upala",
    "Los Chiles",
    "Guatuso",
    "Río Cuarto",
  ],
  Cartago: [
    "Cartago",
    "Paraíso",
    "La Unión",
    "Jiménez",
    "Turrialba",
    "Alvarado",
    "Oreamuno",
    "El Guarco",
  ],
  Heredia: [
    "Heredia",
    "Barva",
    "Santo Domingo",
    "Santa Bárbara",
    "San Rafael",
    "San Isidro",
    "Belén",
    "Flores",
    "Sarapiquí",
  ],
  Guanacaste: [
    "Liberia",
    "Nicoya",
    "Santa Cruz",
    "Bagaces",
    "Carrillo",
    "Cañas",
    "Abangares",
    "Tilarán",
    "Nandayure",
    "La Cruz",
    "Hojancha",
  ],
  Puntarenas: [
    "Puntarenas",
    "Esparza",
    "Buenos Aires",
    "Montes de Oro",
    "Osa",
    "Quepos",
    "Golfito",
    "Coto Brus",
    "Parrita",
    "Corredores",
    "Garabito",
  ],
  Limón: ["Limón", "Pococí", "Siquirres", "Talamanca", "Matina", "Guácimo"],
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
};

type CheckoutFields = {
  nombre: string;
  apellidos: string;
  direccion: string;
  telefono: string;
  provincia: string;
  canton: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  titular: string;
  cartItems: CartItem[];
};

export default function CheckoutPage() {
  const [provincia, setProvincia] = useState("San José");
  const [canton, setCanton] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState<
    "visa" | "mastercard" | "amex" | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [titular, setTitular] = useState("");
  const [errores, setErrores] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { validate } = useCheckoutValidation();
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<
    "success" | "warning" | "error" | null
  >(null);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = "/";
      return;
    }

    setLoading(true);

    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const cleanedCart = cart.map((item: any) => ({
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity || 1),
      }));
      setCartItems(cleanedCart);
    };

    loadCart();

    window.addEventListener("storage", (e) => e.key === "cart" && loadCart());
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const detectarTipo = (number: string) => {
    if (/^4/.test(number)) return "visa";
    if (/^5[1-5]/.test(number)) return "mastercard";
    if (/^3[47]/.test(number)) return "amex";
    return null;
  };
  const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, "");

    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }

    setExpiryDate(value);
  };
  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCardNumber(value);
    setCardType(detectarTipo(value));
  };
  const handleSubmit = async () => {
    const errores = validate({
      nombre,
      apellidos,
      direccion,
      telefono,
      provincia,
      canton,
      cardNumber,
      expiryDate,
      cvv,
      titular,
      cartItems,
    });
    if (Object.keys(errores).length > 0) {
      setFieldErrors(errores);
      setToastType("error");
      setToastMessage("Revisa los campos del formulario antes de continuar.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    try {
      const res = await fetch("https://bobcats-api.onrender.com/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardNumber,
          expiryDate,
          cvc: cvv,
          currency: "CRC", // o podés permitir que el usuario elija
        }),
      });

      const data = await res.json();

      if (data.success) {
        setToastType("success");
        setToastMessage("¡Pago aprobado correctamente!");
        setShowToast(true);

        // NUEVO: agregar al historial
        const user = getCurrentUser();
        if (user) {
          await addUserPurchase({
            purchaseId: "P-" + Date.now(),
            date: new Date().toISOString(),
            items: cartItems,
            total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          });
        }

        clearCart();
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setToastType("error");
        setToastMessage("Error al procesar el pago: " + data.message);
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error en la API:", error);
      setToastType("error");
      setToastMessage("No se pudo conectar con la pasarela de pagos.");
      setShowToast(true);
    }
  };
  function clearCart() {
    const updatedCart: CartItem[] = [];
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateUserCart(updatedCart); // Si estás sincronizando con backend
    window.dispatchEvent(new Event("cartUpdated"));
  }
  // Validación de campos al perder el foco
  const validateField = (field: string, value: string) => {
    const errors = validate({
      nombre,
      apellidos,
      direccion,
      telefono,
      provincia,
      canton,
      cardNumber,
      expiryDate,
      cvv,
      titular,
      cartItems,
    });
    setFieldErrors((prev) => ({ ...prev, [field]: errors[field] || "" }));
  };
  if (!loading) return;

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Dirección de Envío</h2>
          <div className="flex gap-4">
            <div className="w-1/2">
              <input
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, nombre: "" }));
                }}
                onBlur={(e) => validateField("nombre", e.target.value)}
                type="text"
                placeholder="Nombre"
                className="w-full p-3 border rounded"
              />
              {fieldErrors.nombre && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.nombre}
                </p>
              )}
            </div>

            <div className="w-1/2">
              <input
                value={apellidos}
                onChange={(e) => {
                  setApellidos(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, apellidos: "" }));
                }}
                onBlur={(e) => validateField("apellidos", e.target.value)}
                type="text"
                placeholder="Apellidos"
                className="w-full p-3 border rounded"
              />
              {fieldErrors.apellidos && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.apellidos}
                </p>
              )}
            </div>
          </div>
          <div className="w-1/2">
            <input
              value={direccion}
              onChange={(e) => {
                setDireccion(e.target.value);
                setFieldErrors((prev) => ({ ...prev, direccion: "" }));
              }}
              onBlur={(e) => validateField("direccion", e.target.value)}
              type="text"
              placeholder="Dirección"
              className="w-full p-3 border rounded"
            />
            {fieldErrors.direccion && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.direccion}
              </p>
            )}
          </div>
          <input
            type="text"
            placeholder="Casa, apartamento, etc. (opcional)"
            className="w-full p-3 border rounded"
          />
          <div className="flex gap-4">
            <div className="w-1/2">
              <select
                value={provincia}
                onChange={(e) => {
                  setProvincia(e.target.value);
                  setCanton("");
                  setFieldErrors((prev) => ({
                    ...prev,
                    provincia: "",
                    canton: "",
                  }));
                }}
                onBlur={(e) => validateField("provincia", e.target.value)}
                className="w-full p-3 border rounded"
              >
                <option value="">Seleccione una provincia</option>
                {Object.keys(provinciasYCantones).map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
              {fieldErrors.provincia && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.provincia}
                </p>
              )}
            </div>

            <div className="w-1/2">
              <select
                value={canton}
                onChange={(e) => {
                  setCanton(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, canton: "" }));
                }}
                onBlur={(e) => validateField("canton", e.target.value)}
                className="w-full p-3 border rounded"
              >
                <option value="">Seleccione un cantón</option>
                {provincia &&
                  provinciasYCantones[provincia]?.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
              {fieldErrors.canton && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.canton}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <input
                value={telefono}
                onChange={(e) => {
                  setTelefono(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, telefono: "" }));
                }}
                onBlur={(e) => validateField("telefono", e.target.value)}
                type="tel"
                placeholder="Teléfono"
                className="w-full p-3 border rounded"
              />
              {fieldErrors.telefono && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.telefono}
                </p>
              )}
            </div>
            <div className="w-1/2">
              <input
                type="text"
                placeholder="Código postal (opcional)"
                className="w-full p-3 border rounded"
              />
            </div>
          </div>

          <div className="border p-4 rounded space-y-3 bg-gray-50 mt-6">
            <h3 className="text-lg font-bold">Pago</h3>
            <p className="text-sm text-gray-500">
              Todas las transacciones son seguras y están encriptadas.
            </p>

            {/* Número de tarjeta */}
            <label className="block font-medium text-sm">
              Número de tarjeta
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={16}
                value={cardNumber}
                onChange={(e) => {
                  handleCardInput(e);
                  setFieldErrors((prev) => ({ ...prev, cardNumber: "" }));
                }}
                onBlur={(e) => validateField("cardNumber", e.target.value)}
                placeholder="XXXX XXXX XXXX XXXX"
                className="w-full p-3 border rounded pr-16"
              />
              {cardType && (
                <div className="absolute top-1/2 right-3 -translate-y-1/2">
                  <Image
                    src={`/icons/${cardType}.svg`}
                    alt={cardType}
                    width={48}
                    height={30}
                  />
                </div>
              )}
            </div>
            {fieldErrors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.cardNumber}
              </p>
            )}

            {/* Fecha de vencimiento y CVV */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <input
                  value={expiryDate}
                  onChange={(e) => {
                    handleExpiryInput(e);
                    setFieldErrors((prev) => ({ ...prev, expiryDate: "" }));
                  }}
                  onBlur={(e) => validateField("expiryDate", e.target.value)}
                  placeholder="MM/AA"
                  className="w-full p-3 border rounded"
                />
                {fieldErrors.expiryDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.expiryDate}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <input
                  value={cvv}
                  onChange={(e) => {
                    setCvv(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, cvv: "" }));
                  }}
                  onBlur={(e) => validateField("cvv", e.target.value)}
                  type="text"
                  placeholder="Código de seguridad"
                  className="w-full p-3 border rounded"
                />
                {fieldErrors.cvv && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.cvv}</p>
                )}
              </div>
            </div>

            {/* Nombre del titular */}
            <input
              value={titular}
              onChange={(e) => {
                setTitular(e.target.value);
                setFieldErrors((prev) => ({ ...prev, titular: "" }));
              }}
              onBlur={(e) => validateField("titular", e.target.value)}
              type="text"
              placeholder="Nombre del titular"
              className="w-full p-3 border rounded"
            />
            {fieldErrors.titular && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.titular}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="bg-black text-white w-full py-3 rounded font-semibold mt-6"
          >
            Pagar ahora
          </button>

          {errores.length > 0 && (
            <div className="bg-red-100 text-red-700 p-4 mt-4 rounded">
              <ul className="list-disc list-inside">
                {errores.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Resumen */}
        <div className="bg-white p-6 rounded shadow-lg sticky top-10 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Resumen</h2>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex gap-4 border-b pb-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  {item.selectedSize && (
                    <p className="text-sm text-gray-500">
                      Talla {item.selectedSize}
                    </p>
                  )}
                  {item.selectedColor && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">Color:</span>
                      <span
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: item.selectedColor }}
                      />
                    </div>
                  )}
                  <p className="mt-2 font-semibold">
                    ₡
                    {(item.price * item.quantity).toLocaleString("es-CR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>
              ₡{total.toLocaleString("es-CR", { minimumFractionDigits: 2 })}
            </span>
          </p>
        </div>
        {toastType && (
          <Toast show={showToast} type={toastType} message={toastMessage} />
        )}
      </div>
    </div>
  );
}
