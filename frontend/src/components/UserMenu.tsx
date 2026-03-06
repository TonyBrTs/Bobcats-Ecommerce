'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getCurrentUser } from '@/utils/auth';
import { LogOut, ReceiptText, Settings, User } from 'lucide-react';

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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    router.replace('/');
    window.location.reload();
  };

  const handleClick = () => {
    if (!user) {
      router.push('/login');
    } else {
      setOpen(!open);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="flex items-center gap-1 cursor-pointer hover:text-accent transition-colors"
      >
        <User className="w-6 h-6 text-text-secondary" />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 cursor-pointer"
          onClick={() => setOpen(false)}
        />
      )}

      {open && user && (
        <div className="absolute right-0 mt-2 w-60 bg-surface-elevated border border-border-custom rounded-xl shadow-xl dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] z-50 animate-fade-in text-sm overflow-hidden transition-colors duration-300">
          <div className="px-4 py-3 bg-surface border-b border-border-custom text-text-primary">
            <p className="font-semibold truncate">{user.username}</p>
          </div>
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-text-primary hover:bg-surface transition cursor-pointer"
          >
            <User className="w-4 h-4" />
            Perfil
          </button>

          <button
            onClick={() => router.push('/purchase-history')}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-text-primary hover:bg-surface transition cursor-pointer"
          >
            <ReceiptText className="w-4 h-4" />
            Historial de compras
          </button>

          <button
            onClick={() => router.push('/settings')}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-text-primary hover:bg-surface transition cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            Configuración
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
