import HeroCarousel from '@/components/Carousel/HeroCarousel';
import { getImageUrl } from '@/config/api';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Headphones, Sparkles } from 'lucide-react';

export default function Home() {
  const categories = [
    {
      title: 'Hombre',
      description: 'Prendas y calzado técnico diseñados para resistir cualquier terreno.',
      image: '/Carousel/Equipment.png',
      link: '/productos?category=hombre',
    },
    {
      title: 'Mujer',
      description: 'Comodidad, ajuste ergonómico y estilo en tus rutas outdoor.',
      image: '/Carousel/Walk.png',
      link: '/productos?category=mujer',
    },
    {
      title: 'Accesorios',
      description: 'Botellas, mochilas y equipamiento esencial para tu aventura.',
      image: '/Carousel/Camping.png',
      link: '/productos?category=accesorios',
    },
  ];

  return (
    <div className="bg-background text-text-primary transition-colors duration-300">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Trust & Guarantee Banner */}
      <section className="border-y border-border-custom bg-surface-elevated py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <Truck className="w-8 h-8 text-accent" />
            <div className="text-left">
              <h4 className="font-bold text-base">Envíos Rápidos y Seguros</h4>
              <p className="text-sm text-text-muted">A todo el país con seguimiento en tiempo real</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="w-8 h-8 text-accent" />
            <div className="text-left">
              <h4 className="font-bold text-base">Garantía Bobcats</h4>
              <p className="text-sm text-text-muted">Materiales resistentes probados en exteriores</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Headphones className="w-8 h-8 text-accent" />
            <div className="text-left">
              <h4 className="font-bold text-base">Soporte Personalizado</h4>
              <p className="text-sm text-text-muted">Te asesoramos para elegir tu equipo ideal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> Explora por Categoría
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary">
            Equípate para la Aventura
          </h2>
          <p className="mt-3 text-lg text-text-secondary max-w-2xl mx-auto">
            Encuentra exactamente lo que necesitas para tu próxima salida al aire libre.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden bg-surface-elevated border border-border-custom shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="relative w-full h-52 mb-4 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={getImageUrl(cat.image)}
                    alt={cat.title}
                    fill
                    quality={100}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">{cat.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{cat.description}</p>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={cat.link}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-accent text-white font-semibold hover:opacity-90 transition-all duration-200"
                >
                  Ver Categoría <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-14 bg-gradient-to-r from-accent/90 to-accent text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para tu próxima expedición?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Descubre nuestro catálogo completo con las últimas novedades en calzado, ropa y accesorios de montaña.
          </p>
          <Link
            href="/productos"
            className="inline-block bg-white text-accent font-bold py-3.5 px-8 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300"
          >
            Explorar Catálogo Completo
          </Link>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-surface transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-text-primary">
            ¿Por qué elegir Bobcats?
          </h2>
          <p className="text-center text-lg mb-12 text-text-secondary max-w-xl mx-auto">
            Diseñado en Costa Rica para acompañarte en cada ruta, montaña y desafío.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl p-6 text-center bg-surface-elevated border border-border-custom shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="relative w-48 h-48 mb-4 mx-auto">
                <Image
                  src={getImageUrl('/Carousel/Equipment.png')}
                  alt="Equipamiento"
                  fill
                  quality={100}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h3 className="font-bold text-xl mb-2 text-text-primary">Resistencia Superior</h3>
              <p className="text-text-secondary text-sm">
                Materiales duraderos preparados para soportar cualquier condición climática.
              </p>
            </div>

            <div className="rounded-xl p-6 text-center bg-surface-elevated border border-border-custom shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="relative w-48 h-48 mb-4 mx-auto">
                <Image
                  src={getImageUrl('/Carousel/Camping.png')}
                  alt="Camping"
                  fill
                  quality={100}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h3 className="font-bold text-xl mb-2 text-text-primary">Confort en Ruta</h3>
              <p className="text-text-secondary text-sm">
                Diseños ergonómicos pensados para largas caminatas y máxima movilidad.
              </p>
            </div>

            <div className="rounded-xl p-6 text-center bg-surface-elevated border border-border-custom shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="relative w-48 h-48 mb-4 mx-auto">
                <Image
                  src={getImageUrl('/Carousel/Walk.png')}
                  alt="Caminata"
                  fill
                  quality={100}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h3 className="font-bold text-xl mb-2 text-text-primary">Estilo Versátil</h3>
              <p className="text-text-secondary text-sm">
                Ropa y accesorios funcionales que lucen bien tanto en la montaña como en la ciudad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
