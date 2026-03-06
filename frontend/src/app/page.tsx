import HeroCarousel from '@/components/Carousel/HeroCarousel';
import { getImageUrl } from '@/config/api';
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <HeroCarousel />

      {/* Welcome Section */}
      <section className="py-10 bg-surface transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-6 text-text-primary">
            Bienvenido a Bobcats
          </h1>
          <p className="text-center text-xl mb-12 text-text-secondary">
            Andá andá con Bobcats. Descubre nuestros productos y vive la aventura en cada paso.
          </p>
          {/* Featured Benefits */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg shadow-lg dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] p-6 text-center h-90 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-surface-elevated border border-transparent dark:border-border-custom">
              <div className="relative w-60 h-60 mb-4 mx-auto">
                <Image
                  src={getImageUrl('/Carousel/Equipment.png')}
                  alt="Aventura"
                  fill
                  quality={100}
                  style={{ objectFit: 'contain' }}
                  className="mx-auto"
                />
              </div>
              <div className="flex-grow flex flex-col justify-end">
                <p className="text-text-secondary text-lg">
                  Equipamiento y prendas para explorar el mundo natural con estilo.
                </p>
              </div>
            </div>
            <div className="rounded-lg shadow-lg dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] p-6 text-center h-90 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-surface-elevated border border-transparent dark:border-border-custom">
              <div className="relative w-60 h-60 mb-4 mx-auto">
                <Image
                  src={getImageUrl('/Carousel/Camping.png')}
                  alt="Calidad"
                  fill
                  quality={100}
                  style={{ objectFit: 'contain' }}
                  className="mx-auto"
                />
              </div>
              <div className="flex-grow flex flex-col justify-end">
                <p className="text-text-secondary text-lg">
                  Te respaldamos en cada desafío de tus decisiones.
                </p>
              </div>
            </div>
            <div className="rounded-lg shadow-lg dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] p-6 text-center h-90 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-surface-elevated border border-transparent dark:border-border-custom">
              <div className="relative w-60 h-60 mb-4 mx-auto">
                <Image
                  src={getImageUrl('/Carousel/Walk.png')}
                  alt="Soporte"
                  fill
                  quality={100}
                  style={{ objectFit: 'contain' }}
                  className="mx-auto"
                />
              </div>
              <div className="flex-grow flex flex-col justify-end">
                <p className="text-text-secondary text-lg">
                  Nuestro equipo está aquí para apoyarte en cada paso de tu aventura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
