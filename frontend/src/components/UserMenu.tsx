"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  ReceiptText
} from "lucide-react";
import { getCurrentUser } from "@/utils/auth";

export default function UserMenu() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Cierra el menú cuando cambia la ruta
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    router.replace("/");
    window.location.reload();
  };

  const handleClick = () => {
    if (!user) {
      router.push("/login");
    } else {
      setOpen(!open);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="flex items-center gap-1 cursor-pointer hover:text-[#4C6B37] transition-colors"
      >
        <User className="w-6 h-6 text-gray-700" />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {open && user && (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fade-in text-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b text-gray-700">
            <p className="font-semibold truncate">{user.username}</p>
          </div>
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
          >
            <User className="w-4 h-4" />
            Perfil
          </button>
          
          <button
            onClick={() => router.push("/purchase-history")}
            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
          >
            <ReceiptText className="w-4 h-4" />
            Historial de compras
          </button>

          <button
            onClick={() => router.push("/settings")}
            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            Configuración
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
