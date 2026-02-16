import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "../components/Footer/Footer";
import CookieBanner from "@/components/CookieBanner"; // 👈 Agregado
import { Outfit } from "next/font/google";

// Font styles
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "300", "400", "600", "700", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Bobcats | Hiking Shop",
  description: "Explora tu naturaleza con Bobcats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
