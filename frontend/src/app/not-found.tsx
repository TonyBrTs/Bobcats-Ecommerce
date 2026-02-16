"use client";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#36492C] text-white px-4 text-center">
      <h1 className="text-7xl font-extrabold mb-4 tracking-wider text-[#E8EDE1]">
        404
      </h1>
      <h2 className="text-2xl font-semibold mb-2">
        Este no es el sendero que estás buscando...
      </h2>
      <p className="mb-6 text-[#CBD5C0]">
        Parece que te saliste del camino. Intenta regresar al inicio o explorar
        otra ruta.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-[#507D38] text-white rounded hover:bg-[#40642c] transition"
      >
        Volver al campamento base
      </a>
    </div>
  );
}
