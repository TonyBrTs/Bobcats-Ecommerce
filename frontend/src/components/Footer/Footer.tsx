'use client';

import { getImageUrl } from '@/config/api';
import { Instagram, Mail, Minus, Music2, Phone, Plus, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import AccordionContent from './AccordionContent';

const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-[#4C6B37] dark:bg-[#141414] text-white/90 transition-colors duration-300">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1 flex flex-col items-start">
            <Image
              src={getImageUrl('/Logo_Blanco_Transparente.png')}
              alt="Bobcats Logo"
              width={80}
              height={80}
              className="h-auto w-20 object-contain mb-4"
            />
            <p className="text-sm text-white/60 leading-relaxed">
              Tu tienda de confianza con los mejores productos y la mejor atención.
            </p>
          </div>

          {/* Navegación */}
          <div className="border-t border-white/10 pt-4 md:border-none md:pt-0">
            <div
              className="flex justify-between items-center md:block cursor-pointer md:cursor-default"
              onClick={() => toggleSection('NAV')}
            >
              <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">
                Navegación
              </h4>
              <span className="md:hidden text-white/40">
                {openSection === 'NAV' ? <Minus size={16} /> : <Plus size={16} />}
              </span>
            </div>
            <AccordionContent isOpen={openSection === 'NAV'}>
              <li>
                <Link
                  href="/productos"
                  className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                >
                  Quiénes Somos
                </Link>
              </li>
            </AccordionContent>
          </div>

          {/* Ayuda */}
          <div className="border-t border-white/10 pt-4 md:border-none md:pt-0">
            <div
              className="flex justify-between items-center md:block cursor-pointer md:cursor-default"
              onClick={() => toggleSection('AYUDA')}
            >
              <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">
                Ayuda
              </h4>
              <span className="md:hidden text-white/40">
                {openSection === 'AYUDA' ? <Minus size={16} /> : <Plus size={16} />}
              </span>
            </div>
            <AccordionContent isOpen={openSection === 'AYUDA'}>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                >
                  Políticas de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                >
                  Políticas de envío
                </Link>
              </li>
            </AccordionContent>
          </div>

          {/* Contacto */}
          <div className="border-t border-white/10 pt-4 md:border-none md:pt-0">
            <div
              className="flex justify-between items-center md:block cursor-pointer md:cursor-default"
              onClick={() => toggleSection('CONTACTO')}
            >
              <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">
                Contacto
              </h4>
              <span className="md:hidden text-white/40">
                {openSection === 'CONTACTO' ? <Minus size={16} /> : <Plus size={16} />}
              </span>
            </div>
            <AccordionContent isOpen={openSection === 'CONTACTO'}>
              <li>
                <a
                  href="mailto:BOBCATS@bobcats.com"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-200"
                >
                  <Mail size={14} className="text-white/40 shrink-0" />
                  bobcats@bobcats.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+50612345678"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-200"
                >
                  <Phone size={14} className="text-white/40 shrink-0" />
                  (+506) 1234-5678
                </a>
              </li>
            </AccordionContent>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-xs text-white/30 order-2 md:order-1">
            © {new Date().getFullYear()} Bobcats. Todos los derechos reservados.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-5 order-1 md:order-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors duration-200"
              aria-label="TikTok"
            >
              <Music2 size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors duration-200"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
