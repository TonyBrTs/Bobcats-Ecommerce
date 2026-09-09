'use client';

import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-surface cursor-pointer"
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      <Sun className="w-5 h-5 text-text-secondary hover:text-accent transition-colors hidden dark:block" />
      <Moon className="w-5 h-5 text-text-secondary hover:text-accent transition-colors block dark:hidden" />
    </button>
  );
}
