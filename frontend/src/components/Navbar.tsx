'use client';

import { getImageUrl } from '@/config/api';
import { useTheme } from '@/context/ThemeContext';
import { getCurrentUser } from '@/utils/auth';
import { Heart, Menu, Search, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CartDrawer from './CartDrawer';
import FavoriteDrawer from './FavoriteDrawer';
import SearchDrawer from './SearchDrawer';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';

/**
 * Navbar component for the website.
 *
 * @returns Navbar component for the website.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const [searchOpen, setSearchOpen] = useState(false);
  const [favoriteDrawerOpen, setFavoriteDrawerOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const navLinks = [
    {
      name: 'Hombre',
      href: '/productos',
      submenu: [
        { name: 'Camisetas' },
        { name: 'Pantalones & shorts' },
        { name: 'Jackets & abrigos' },
        { name: 'Calzado' },
      ],
    },
    {
      name: 'Mujer',
      href: '/productos',
      submenu: [
        { name: 'Camisetas' },
        { name: 'Pantalones & shorts' },
        { name: 'Jackets & abrigos' },
        { name: 'Calzado' },
      ],
    },
    {
      name: 'Accesorios',
      href: '/productos',
      submenu: [
        { name: 'Bolsos' },
        { name: 'Botellas' },
        { name: 'Gorras y gorros' },
        { name: 'Lentes de sol' },
      ],
    },
    {
      name: 'Ofertas',
      href: '/productos',
      submenu: [
        { name: 'Ropa' },
        { name: 'Calzado' },
        { name: 'Accesorios' },
        { name: 'Gift Sets' },
      ],
    },
  ];

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    if (user) {
      const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.length);
      };

      updateCartCount();
      window.addEventListener('cartUpdated', updateCartCount);
      return () => window.removeEventListener('cartUpdated', updateCartCount);
    }
  }, [user]);

  const handleFavoriteClick = () => {
    setFavoriteDrawerOpen(!favoriteDrawerOpen);
  };

  // Choose logo based on theme
  const logoSrc =
    theme === 'dark'
      ? getImageUrl('/Logo_Blanco_Transparente.png')
      : getImageUrl('/Logo_Verde_Trasparente.png');

  return (
    <>
      <header className="w-full bg-background text-text-primary border-b-[6px] border-accent px-6 py-3 shadow-md dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] z-40 relative transition-colors duration-300">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <img src={logoSrc} alt="Logo" className="w-16 lg:w-17 h-auto object-contain" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-lg font-medium relative">
            {navLinks.map(({ name, submenu }) => (
              <div key={name} className="relative group flex items-center">
                <Link
                  href={{
                    pathname: '/productos',
                    query: { category: name.toLowerCase(), subcategory: '' },
                  }}
                  className={`relative px-2 py-1 transition-colors duration-300 group-hover:text-accent after:block after:h-[2px] after:bg-accent after:transition-transform after:duration-300 after:origin-left
                    ${
                      selectedCategory === name.toLowerCase()
                        ? 'after:scale-x-100 text-accent'
                        : 'after:scale-x-0 group-hover:after:scale-x-100'
                    }`}
                >
                  {name}
                </Link>

                {/* Submenu */}
                {submenu.length > 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-[1px] hidden group-hover:flex bg-surface-elevated shadow-lg border border-border-custom rounded-md z-50 px-4 py-3 gap-6 min-w-max transition-colors duration-300">
                    {submenu.map((item) => (
                      <Link
                        key={item.name}
                        href={{
                          pathname: '/productos',
                          query: {
                            category: name.toLowerCase(),
                            subcategory: item.name.toLowerCase(),
                          },
                        }}
                        className="whitespace-nowrap font-semibold text-text-primary text-base hover:text-accent hover:bg-surface px-2 py-1 rounded transition-all"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Search
              className="w-6 h-6 cursor-pointer text-text-secondary hover:text-accent transition-colors"
              onClick={() => setSearchOpen(true)}
            />
            <div className="relative cursor-pointer" onClick={handleFavoriteClick}>
              <Heart className="w-6 h-6 text-text-secondary hover:text-accent transition-colors" />
            </div>
            <UserMenu />

            {user && (
              <div className="relative cursor-pointer" onClick={() => setCartOpen(true)}>
                <ShoppingCart className="w-6 h-6 text-text-secondary hover:text-accent transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            )}

            <button onClick={toggleMenu} className="lg:hidden">
              {menuOpen ? (
                <X className="w-5 h-5 text-text-secondary" />
              ) : (
                <Menu className="w-5 h-5 text-text-secondary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-96 mt-4 px-6' : 'max-h-0 px-6'
          }`}
        >
          <div className="space-y-3">
            {navLinks.map(({ name }) => (
              <Link
                key={name}
                href={{
                  pathname: '/productos',
                  query: { category: name.toLowerCase() },
                }}
                className={`block text-sm font-medium text-text-primary hover:text-accent relative after:block after:h-[2px] after:bg-accent after:transition-transform after:duration-300 after:origin-left
                  ${
                    selectedCategory === name.toLowerCase()
                      ? 'after:scale-x-100 text-accent'
                      : 'after:scale-x-0 hover:after:scale-x-100'
                  }`}
              >
                {name}
              </Link>
            ))}

            <hr className="my-4 border-border-custom" />
            {user ? (
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  localStorage.removeItem('cart');
                  router.replace('/');
                  window.location.reload();
                }}
                className="block text-xs text-red-600 dark:text-red-400 font-semibold uppercase tracking-wide hover:underline cursor-pointer"
              >
                Cerrar sesión
              </button>
            ) : (
              <Link
                href="/login"
                className="block text-xs text-accent font-semibold uppercase tracking-wide hover:underline"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      {/* Search Drawer */}
      <SearchDrawer isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      {/* Favorite Drawer */}
      <FavoriteDrawer isOpen={favoriteDrawerOpen} onClose={() => setFavoriteDrawerOpen(false)} />
    </>
  );
}
