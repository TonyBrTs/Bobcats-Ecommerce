'use client'

import { useState } from "react"
import { Instagram, Twitter, Music2, Minus, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link" 
import AccordionContent from "./AccordionContent"

// Footer component for the website.
const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <footer className="bg-[#4C6B37] text-white py-10 px-6 md:px-16 flex flex-col md:flex-row justify-between flex-wrap gap-8">
      
      {/* CONTACTO */}
      <div className="min-w-[200px]">
        <h4 className="font-bold mb-3 text-2xl">CONTACTO</h4>
        <p>
          <a href="mailto:BOBCATS@bobcats.com" className="text-[#ffffff] hover:underline text-xl">
            BOBCATS@bobcats.com
          </a>
        </p>
        <p>
          <a href="tel:+50612345678" className="text-[#ffffff] hover:underline text-xl">
            (+506) 1234-5678
          </a>
        </p>
      </div>

      {/* AYUDA */}
      <div className="min-w-[200px] border-t md:border-none pt-4 md:pt-0">
        <div
          className="flex justify-between items-center md:block cursor-pointer md:cursor-default"
          onClick={() => toggleSection('AYUDA')}
        >
          <h4 className="font-bold mb-3 text-2xl">AYUDA</h4>
          <span className="md:hidden">
            {openSection === 'AYUDA' ? <Minus /> : <Plus />}
          </span>
        </div>
        <AccordionContent isOpen={openSection === 'AYUDA'}>
          <ul className="flex flex-col gap-2">
            <li className="text-xl">
              <Link href="/privacy-policy" className="hover:underline">
                Políticas de privacidad
              </Link>
            </li>
            <li className="text-xl">
              <Link href="/shipping-policy" className="hover:underline">
                Políticas de envío
              </Link>
            </li>
          </ul>
        </AccordionContent>
      </div>

      {/* NOSOTROS */}
      <div className="min-w-[200px] border-t md:border-none pt-4 md:pt-0">
        <div
          className="flex justify-between items-center md:block cursor-pointer md:cursor-default"
          onClick={() => toggleSection('NOSOTROS')}
        >
          <h4 className="font-bold mb-3 text-2xl">NOSOTROS</h4>
          <span className="md:hidden">
            {openSection === 'NOSOTROS' ? <Minus /> : <Plus />}
          </span>
        </div>
        <AccordionContent isOpen={openSection === 'NOSOTROS'}>
          <ul className="flex flex-col gap-2">
            <li className="text-xl">
              <Link href="/about-us" className="hover:underline">
                Quiénes Somos
              </Link>
            </li>
          </ul>
        </AccordionContent>
      </div>

      {/* LOGO + REDES */}
      <div className="flex flex-col items-center w-full md:w-auto mt-6 md:mt-0">
        <div className="flex gap-4 mb-4">
          <Instagram className="w-8 h-8 text-white hover:text-green-200 cursor-pointer" />
          <Music2 className="w-8 h-8 text-white hover:text-green-200 cursor-pointer" />
          <Twitter className="w-8 h-8 text-white hover:text-green-200 cursor-pointer" />
        </div>
        <Image
          src="http://localhost:3001/Logo_Blanco_Transparente.png"
          alt="Logo Blanco"
          width={80}
          height={80}
          className="h-auto w-auto"
        />
      </div>
    </footer>
  )
}

export default Footer
