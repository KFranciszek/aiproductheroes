'use client';

import type { Metadata } from 'next';
import { useEffect } from 'react';
import '../demo5-globals.css';

export default function Demo5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    return () => {
      // Cleanup demo5 theme classes when leaving
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark', 'light');
      }
    };
  }, []);

  return children;
}
