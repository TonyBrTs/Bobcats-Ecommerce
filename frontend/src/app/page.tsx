'use client';

import HeroCarousel from '@/components/Carousel/HeroCarousel';
import ProductCard from '@/components/Products/ProductCard';
import { API_ENDPOINTS, getImageUrl } from '@/config/api';
import type { Product } from '@/types/Product';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Compass,
  CreditCard,
  Flame,
  Headphones,
  Mail,
  MapPin,
  Mountain,
  ShieldCheck,
  Star,
  Tag,
  TrendingUp,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

// Department categories configuration
const departments = [
  {
    id: 'hombre',
    title: 'Hombre',
    subtitle: 'Calzado & Ropa Técnica',
    description: 'Prendas y calzado técnico diseñados para resistir cualquier terreno.',
    image: '/Carousel/Equipment.png',
    link: '/productos?category=hombre',
    badge: 'Popular',
  },
  {
    id: 'mujer',
    title: 'Mujer',
    subtitle: 'Confort & Estilo Outdoor',
    description: 'Comodidad, ajuste ergonómico y estilo en tus rutas de montaña.',
    image: '/Carousel/Walk.png',
    link: '/productos?category=mujer',
    badge: 'Tendencia',
  },
  {
    id: 'accesorios',
    title: 'Accesorios',
    subtitle: 'Equipamiento Esencial',
    description: 'Botellas, mochilas, gorras y complementos indispensables.',
    image: '/Carousel/Camping.png',
    link: '/productos?category=accesorios',
    badge: 'Esenciales',
  },
  {
    id: 'ofertas',
    title: 'Zona Ofertas',
    subtitle: 'Hasta 30% OFF',
    description: 'Precios especiales en equipamiento y calzado seleccionado.',
    image: '/Carousel/carousel-1.png',
    link: '/productos?category=ofertas',
    badge: 'Descuentos',
    isOffer: true,
  },
];

// Curated reviews from actual adventurers
const reviews = [
  {
    name: 'Carlos Montero',
    location: 'Cumbre Cerro Chirripó',
    rating: 5,
    comment:
      'Las Botas Rock me acompañaron durante los 40 km del Chirripó sin una sola molestia ni filtración. El agarre en terreno rocoso es insuperable.',
    date: 'Hace 2 semanas',
    product: 'Botas Rock - BOBCATS',
  },
  {
    name: 'Valeria Rojas',
    location: 'Ruta Volcán Barva',
    rating: 5,
    comment:
      'La Jacket Trail es increíblemente liviana pero bloquea el viento helado a la perfección. Además el corte y los acabados son de primera.',
    date: 'Hace 1 mes',
    product: 'Jacket Trail - BOBCATS',
  },
  {
    name: 'Esteban Quesada',
    location: 'Rápidos del Río Pacuare',
    rating: 5,
    comment:
      'Compré el Drybag y la Botella River para rafting. El drybag mantuvo mi equipo totalmente seco y la botella mantuvo el agua fría por horas.',
    date: 'Hace 3 semanas',
    product: 'Drybag River - BOBCATS',
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSellerTab, setSelectedSellerTab] = useState<'todos' | 'calzado' | 'ropa' | 'accesorios'>('todos');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Fetch all products from API
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(API_ENDPOINTS.PRODUCTS);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error al cargar productos en Home:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Filter 1: Discounted products (Ofertas)
  const discountedProducts = useMemo(() => {
    return products.filter(
      (p) =>
        (p.originalPrice !== undefined && p.originalPrice > p.price) ||
        p.categories?.includes('ofertas')
    );
  }, [products]);

  // Filter 2: Best sellers (Productos más comprados según base de datos)
  const bestSellerProducts = useMemo(() => {
    // IDs de productos con mayor volumen en historial de compras:
    // 13: Botella River, 3: Botas Rock, 10: Pantalón River, 14: Gorra Aviador, 2: Botas Peak, 17: Hoodie, 7: Zapatos Speed
    const topSellerIds = [13, 3, 10, 14, 2, 7, 17, 11];

    let filtered = products.filter((p) => topSellerIds.includes(p.id));

    // Si aún faltan productos para mostrar una cuadrícula completa, rellenar con otros
    if (filtered.length < 6) {
      const rest = products.filter((p) => !filtered.some((f) => f.id === p.id));
      filtered = [...filtered, ...rest];
    }

    if (selectedSellerTab === 'calzado') {
      return filtered.filter((p) => p.subcategories?.includes('calzado'));
    }
    if (selectedSellerTab === 'ropa') {
      return filtered.filter(
        (p) =>
          p.subcategories?.includes('ropa') ||
          p.subcategories?.includes('jackets & abrigos') ||
          p.subcategories?.includes('camisetas') ||
          p.subcategories?.includes('pantalones & shorts')
      );
    }
    if (selectedSellerTab === 'accesorios') {
      return filtered.filter(
        (p) =>
          p.categories?.includes('accesorios') ||
          p.subcategories?.includes('botellas') ||
          p.subcategories?.includes('gorras y gorros') ||
          p.subcategories?.includes('bolsos') ||
          p.subcategories?.includes('lentes de sol')
      );
    }

    return filtered.slice(0, 8);
  }, [products, selectedSellerTab]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="bg-background text-text-primary transition-colors duration-300">
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      {/* 2. Trust & Guarantee Strip */}
      <section className="border-y border-border-custom bg-surface-elevated/70 py-6 px-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-surface">
            <div className="p-3 rounded-xl bg-accent-light text-accent">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-text-primary">Envíos a Todo Costa Rica</h4>
              <p className="text-xs text-text-secondary mt-0.5">GAM y zonas rurales con tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-surface">
            <div className="p-3 rounded-xl bg-accent-light text-accent">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-text-primary">Garantía Bobcats</h4>
              <p className="text-xs text-text-secondary mt-0.5">Equipamiento probado en montaña</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-surface">
            <div className="p-3 rounded-xl bg-accent-light text-accent">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-text-primary">Pagos 100% Seguros</h4>
              <p className="text-xs text-text-secondary mt-0.5">SINPE Móvil, tarjetas y pasarela protegida</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-surface">
            <div className="p-3 rounded-xl bg-accent-light text-accent">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-text-primary">Asesoría de Aventura</h4>
              <p className="text-xs text-text-secondary mt-0.5">Soporte técnico para tu equipo ideal</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: OFERTAS DE TEMPORADA (Deals / On Sale) */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/50 px-3 py-1 rounded-full mb-3">
              <Flame className="w-4 h-4 fill-red-500 text-red-500 animate-pulse" />
              Ofertas por Tiempo Limitado
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
              Ofertas de Temporada
            </h2>
            <p className="mt-2 text-base text-text-secondary max-w-xl">
              Equípate con los mejores descuentos. Precios especiales en calzado, ropa y accesorios hasta agotar existencias.
            </p>
          </div>

          <Link
            href="/productos?category=ofertas"
            className="inline-flex items-center gap-2 self-start md:self-auto text-accent font-bold hover:text-accent-hover transition-colors group"
          >
            Ver todas las ofertas
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Offers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-surface-elevated animate-pulse border border-border-custom p-4 flex flex-col justify-between"
              >
                <div className="h-44 bg-surface rounded-xl" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-surface rounded w-3/4" />
                  <div className="h-4 bg-surface rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : discountedProducts.length === 0 ? (
          <div className="text-center py-12 text-text-secondary bg-surface rounded-2xl">
            <p>No hay ofertas activas en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {discountedProducts.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/productos/productDetail/${product.id}`}
                className="block"
              >
                <ProductCard {...product} />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. Section: EXPLORAR POR CATEGORÍA (Department Cards) */}
      <section className="py-16 bg-surface px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3.5 py-1 rounded-full mb-3">
              <Compass className="w-4 h-4" /> Departamentos Outdoor
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary">
              Explora por Categoría
            </h2>
            <p className="mt-2 text-base text-text-secondary max-w-2xl mx-auto">
              Todo lo que necesitas para tus salidas a la montaña, caminatas por senderos o expediciones en río.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept) => (
              <Link
                key={dept.id}
                href={dept.link}
                className="group relative rounded-2xl overflow-hidden bg-surface-elevated border border-border-custom shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                {/* Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ${
                      dept.isOffer
                        ? 'bg-red-600 text-white'
                        : 'bg-accent text-white'
                    }`}
                  >
                    {dept.badge}
                  </span>
                </div>

                <div className="p-6">
                  <div className="relative w-full h-44 mb-4 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
                    <Image
                      src={getImageUrl(dept.image)}
                      alt={dept.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      style={{ objectFit: 'contain' }}
                      className="p-2"
                      unoptimized
                    />
                  </div>
                  <span className="text-xs font-medium text-accent block mb-1">
                    {dept.subtitle}
                  </span>
                  <h3 className="text-2xl font-extrabold text-text-primary group-hover:text-accent transition-colors">
                    {dept.title}
                  </h3>
                  <p className="text-text-secondary text-xs mt-2 leading-relaxed line-clamp-2">
                    {dept.description}
                  </p>
                </div>

                <div className="p-6 pt-0">
                  <div className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-surface group-hover:bg-accent group-hover:text-white text-text-primary text-sm font-semibold transition-all duration-300">
                    <span>Ver Colección</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Section: LO MÁS VENDIDO (Best Sellers) */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3.5 py-1 rounded-full mb-3">
              <TrendingUp className="w-4 h-4" /> Los Favoritos de la Montaña
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
              Lo Más Vendido
            </h2>
            <p className="mt-2 text-base text-text-secondary max-w-xl">
              Equipamiento aclamado por senderistas, campistas y aventureros en toda Costa Rica.
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-surface rounded-xl border border-border-custom self-start md:self-auto overflow-x-auto max-w-full">
            {(
              [
                { id: 'todos', label: 'Todos' },
                { id: 'calzado', label: 'Calzado' },
                { id: 'ropa', label: 'Ropa' },
                { id: 'accesorios', label: 'Accesorios' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSellerTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  selectedSellerTab === tab.id
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Best sellers grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-surface-elevated animate-pulse border border-border-custom p-4 flex flex-col justify-between"
              >
                <div className="h-44 bg-surface rounded-xl" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-surface rounded w-3/4" />
                  <div className="h-4 bg-surface rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : bestSellerProducts.length === 0 ? (
          <div className="text-center py-12 text-text-secondary bg-surface rounded-2xl">
            <p>No se encontraron productos en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellerProducts.map((product) => (
              <Link
                key={product.id}
                href={`/productos/productDetail/${product.id}`}
                className="block"
              >
                <ProductCard {...product} badge="🔥 Más Vendido" />
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full bg-accent text-white font-bold hover:bg-accent-hover shadow-lg hover:shadow-accent/30 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Explorar Catálogo Completo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. Section: BRAND STORY / OUTDOOR LIFESTYLE BANNER */}
      <section className="relative my-8 overflow-hidden bg-gradient-to-r from-stone-900 via-neutral-900 to-zinc-950 text-white py-20 px-6">
        {/* Background ambient accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 py-1 px-4 mb-4 text-xs font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md rounded-full text-accent-light border border-white/10">
            <Mountain className="w-4 h-4 text-accent" /> Diseñado en Costa Rica
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            Nacidos para el Clima y la Aventura Tropical
          </h2>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
            Desde la humedad del bosque nuboso hasta los senderos pedregosos de alta montaña. En Bobcats diseñamos equipamiento que no te abandona cuando el camino se pone exigente.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-6 border-t border-white/15">
            <div className="text-center">
              <span className="text-3xl font-black text-accent-light block">+10,000 km</span>
              <span className="text-xs text-gray-400 mt-1 block">Senderos recorridos</span>
            </div>
            <div className="text-center">
              <span className="text-3xl font-black text-accent-light block">100%</span>
              <span className="text-xs text-gray-400 mt-1 block">Materiales probados</span>
            </div>
            <div className="text-center">
              <span className="text-3xl font-black text-accent-light block">24-48 hrs</span>
              <span className="text-xs text-gray-400 mt-1 block">Entrega en todo el país</span>
            </div>
            <div className="text-center">
              <span className="text-3xl font-black text-accent-light block">4.9 / 5</span>
              <span className="text-xs text-gray-400 mt-1 block">Satisfacción garantizada</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section: SOCIAL PROOF / REVIEWS */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3.5 py-1 rounded-full mb-3">
            <Star className="w-4 h-4 fill-accent" /> Comunidad Bobcats
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary">
            Lo que dicen nuestros exploradores
          </h2>
          <p className="mt-2 text-base text-text-secondary max-w-xl mx-auto">
            Testimonios reales de personas que confían en nuestro equipamiento en sus rutas outdoor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-surface-elevated border border-border-custom shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-text-primary italic leading-relaxed mb-6">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-border-custom/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-text-primary">{rev.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-text-secondary mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span>{rev.location}</span>
                  </div>
                </div>
                <span className="text-[11px] text-text-muted">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Section: CLUB BOBCATS NEWSLETTER */}
      <section className="py-16 px-4 bg-surface border-t border-border-custom transition-colors duration-300">
        <div className="max-w-4xl mx-auto rounded-3xl bg-surface-elevated border border-border-custom p-8 md:p-12 shadow-md relative overflow-hidden">
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full mb-3">
              <Tag className="w-3.5 h-3.5" /> 10% Descuento de Bienvenida
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
              Únete al Club de Exploradores Bobcats
            </h2>

            <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed">
              Suscríbete a nuestro boletín y recibe un <span className="font-semibold text-text-primary">10% de descuento</span> en tu primera compra, además de acceso prioritario a nuevos lanzamientos y rutas de montaña.
            </p>

            {newsletterSubscribed ? (
              <div className="mt-8 p-4 rounded-xl bg-accent-light text-accent border border-accent/30 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold">
                  ¡Bienvenido al Club Bobcats! Te hemos enviado tu cupón por correo.
                </span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="email"
                    required
                    placeholder="Tu correo electrónico"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-full border border-border-custom bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="py-3 px-6 rounded-full bg-accent text-white font-bold text-sm hover:bg-accent-hover shadow-md hover:shadow-accent/30 transition-all whitespace-nowrap active:scale-95"
                >
                  Suscribirme
                </button>
              </form>
            )}

            <p className="text-xs text-text-muted mt-4">
              Cero spam. Solo ofertas exclusivas, rutas y contenido de valor outdoor. Puedes cancelar cuando quieras.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
