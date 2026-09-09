// components/HeroCarousel.tsx
"use client"

import "keen-slider/keen-slider.min.css"
import { useKeenSlider } from "keen-slider/react"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, ArrowRight, Flame } from "lucide-react"
import { getImageUrl } from "@/config/api"
import Link from "next/link"

// Component for displaying a carousel of images with titles, locations and CTAs.
const slides = [
  {
    image: getImageUrl("/Carousel/carousel-1.png"),
    badge: "Equípate para la Aventura",
    title: "AVENTURA AL AIRE LIBRE",
    location: "SENDEROS DE COSTA RICA",
    ctaPrimary: { text: "Explorar Catálogo", link: "/productos" },
    ctaSecondary: { text: "Ver Ofertas", link: "/productos?category=ofertas", isOffer: true },
  },
  {
    image: getImageUrl("/Carousel/carousel-2.png"),
    badge: "Calidad y Resistencia",
    title: "EXPLORACIÓN EN RÍO",
    location: "EQUIPAMIENTO IMPERMEABLE",
    ctaPrimary: { text: "Ver Accesorios", link: "/productos?category=accesorios" },
    ctaSecondary: { text: "Ver Ofertas", link: "/productos?category=ofertas", isOffer: true },
  },
  {
    image: getImageUrl("/Carousel/carousel-3.png"),
    badge: "Colección 2026",
    title: "SENDEROS DE MONTAÑA",
    location: "CALZADO & ROPA TÉCNICA",
    ctaPrimary: { text: "Comprar Calzado", link: "/productos?category=hombre&subcategory=calzado" },
    ctaSecondary: { text: "Ver Catálogo", link: "/productos", isOffer: false },
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      origin: "center",
      perView: 1,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
  })

  const next = () => {
    if (instanceRef.current) instanceRef.current.next()
  }

  const prev = () => {
    if (instanceRef.current) instanceRef.current.prev()
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (instanceRef.current) {
        instanceRef.current.next()
      }
    }, 5500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative group overflow-hidden">
      <div ref={sliderRef} className="keen-slider w-full h-[65vh] min-h-[460px] max-h-[680px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="keen-slider__slide relative flex items-center justify-center"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute w-full h-full object-cover select-none"
            />
            {/* Multi-layer gradient overlay for optimal text contrast and premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

            <div className="relative z-10 text-white text-center px-6 max-w-3xl mx-auto flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 py-1 px-3.5 mb-3 text-xs md:text-sm font-semibold uppercase tracking-wider bg-accent/90 backdrop-blur-md rounded-full text-white shadow-md">
                {slide.badge}
              </span>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wider drop-shadow-md">
                {slide.title}
              </h1>

              <p className="text-sm sm:text-lg md:text-xl mt-2 tracking-[0.25em] text-gray-200 drop-shadow font-light">
                {slide.location}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
                <Link
                  href={slide.ctaPrimary.link}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-accent/40 hover:scale-105 active:scale-95 transition-all duration-300 text-sm md:text-base"
                >
                  {slide.ctaPrimary.text}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={slide.ctaSecondary.link}
                  className="inline-flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white font-semibold py-3 px-6 rounded-full border border-white/30 shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 text-sm md:text-base"
                >
                  {slide.ctaSecondary.isOffer && <Flame className="w-4 h-4 text-orange-400" />}
                  {slide.ctaSecondary.text}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            aria-label={`Ir a diapositiva ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === idx ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
