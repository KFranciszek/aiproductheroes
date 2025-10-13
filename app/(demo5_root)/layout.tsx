'use client';

import { useEffect } from 'react';
import '../demo5-globals.css';

export default function Demo5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Ustaw theme demo5 przy mount
    const savedTheme = localStorage.getItem('demo5-theme') || 'dark'
    
    // Wyczyść wszystkie theme classes z innych demo
    document.documentElement.classList.remove('dark', 'light', 'theme-dark-blue')
    
    // Ustaw theme demo5
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
    
    // NIE MA cleanup przy unmount - następna strona ustawi swój theme
  }, []);

  return children;
}
