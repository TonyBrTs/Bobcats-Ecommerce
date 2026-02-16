"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/utils/auth";

export default function ProfilePage() {
  const [user, setUser] = useState<{ username: string; email?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace("/login");
    } else {
      setUser(currentUser);
    }
  }, [router]);

  if (!user) {
    return <div className="p-6 text-center">Cargando perfil...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Perfil de usuario</h1>

      <div className="bg-gray-200 p-6 rounded-lg shadow space-y-4">
        <div>
          <p className="text-gray-600 font-medium">Nombre de usuario</p>
          <p className="text-lg font-semibold">{user.username}</p>
        </div>

        {user.email && (
          <div>
            <p className="text-gray-600 font-medium">Correo electrónico</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
