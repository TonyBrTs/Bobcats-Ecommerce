// app/login/page.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { getUserCart } from "@/utils/cart";
import { API_ENDPOINTS } from "@/config/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error" | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //Validaciones
    if (!email) newErrors.email = "El correo es obligatorio";
    else if (!emailRegex.test(email)) newErrors.email = "Correo inválido";

    if (!password) newErrors.password = "La contraseña es obligatoria";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          //Guarda el token y datos del usuario
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          const userCart = await getUserCart(data.user.username);
          localStorage.setItem("cart", JSON.stringify(userCart));

          setToastType("success");
          setToastMessage("Inicio de sesión exitoso");
          setShowToast(true);

          // Opcional: sonido
          const audio = new Audio("/Sounds/success.wav");
          audio.play().catch(() => {});

          setTimeout(() => {
            setShowToast(false);
            setToastType(null);
            setToastMessage("");
            window.location.href = "/"; // redirección después de mostrar
          }, 1500);
          // router.push('/dashboard');
        } else {
          //setErrors({ email: "Credenciales inválidas" });
          setToastType("error");
          setToastMessage("Credenciales inválidas");
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
            setToastType(null);
            setToastMessage("");
          }, 3000);
        }
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        alert("Error de red");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/login.png')" }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 w-full max-w-md p-8 bg-black/50 backdrop-blur-sm rounded-lg shadow-lg text-white">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-gray-300 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#507D38]"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-gray-300 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#507D38] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-300 hover:text-[#507D38]"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#507D38] text-white py-2 rounded hover:bg-[#3e5f2c] transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="text-center text-sm text-white mt-4">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="text-[#89A086] hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
      {/* Toast general */}
      <div
        role="alert"
        className={`fixed top-5 left-1/2 z-50 transform transition-all duration-300 ease-out ${
          showToast
            ? "-translate-x-1/2 translate-y-0 opacity-100"
            : "-translate-x-1/2 -translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`flex items-center w-full max-w-sm p-4 mb-4 rounded-lg shadow-lg text-base ${
            toastType === "success"
              ? "bg-[#E1F1DC] text-[#2C2C2C]"
              : "bg-[#FADADD] text-[#8B0000]"
          }`}
        >
          <div
            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${
              toastType === "success" ? "bg-[#C8E6C9]" : "bg-[#FFE0E0]"
            }`}
          >
            {toastType === "success" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
              </svg>
            )}
          </div>
          <div className="ms-3 font-medium">{toastMessage}</div>
        </div>
      </div>
    </div>
  );
}
