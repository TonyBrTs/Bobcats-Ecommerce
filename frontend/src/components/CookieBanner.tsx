"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const acceptedCookies = localStorage.getItem("cookiesAccepted");
    if (!acceptedCookies) {
      setShowBanner(true);
      setTimeout(() => setAnimate(true), 50); // activa animación luego de montarse
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-0 inset-x-0 px-6 py-4 z-50 shadow-lg text-white bg-[#36492C] transition-transform duration-500 ease-out ${
        animate ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-sm text-center md:text-left">
          Usamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas su uso.
        </p>
        <div className="flex gap-2">
          <button
            onClick={acceptCookies}
            className="bg-[#507D3B] hover:bg-[#89A086] text-white px-4 py-2 rounded transition"
          >
            Aceptar
          </button>
          <a
            href="/politica-cookies"
            className="text-sm underline text-[#D8E4D1] hover:text-white transition"
          >
            Leer más
          </a>
        </div>
      </div>
    </div>
  );
}
