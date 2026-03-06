import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/context/ThemeContext';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Footer from '../components/Footer/Footer';
import './globals.css';

// Font styles
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['100', '300', '400', '600', '700', '900'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Bobcats | Hiking Shop',
  description: 'Explora tu naturaleza con Bobcats',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <head>
        {/* Inline script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
