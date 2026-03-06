'use client';

import { getCurrentUser } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<{ username: string; email?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace('/login');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  if (!user) {
    return <div className="p-6 text-center text-text-secondary">Cargando perfil...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-text-primary">Perfil de usuario</h1>

      <div className="bg-surface p-6 rounded-lg shadow dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] space-y-4 border border-transparent dark:border-border-custom transition-colors duration-300">
        <div>
          <p className="text-text-secondary font-medium">Nombre de usuario</p>
          <p className="text-lg font-semibold text-text-primary">{user.username}</p>
        </div>

        {user.email && (
          <div>
            <p className="text-text-secondary font-medium">Correo electrónico</p>
            <p className="text-lg font-semibold text-text-primary">{user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
