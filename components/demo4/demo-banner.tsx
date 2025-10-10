"use client";

import Link from "next/link";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DemoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="sticky top-0 z-50 bg-[var(--brand-primary)] text-white">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">
            Tryb demonstracyjny - Wszystkie dane są tymczasowe i można je resetować
          </span>
          <span className="sm:hidden">Tryb demo</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 h-7 text-xs"
          >
            <Link href="/">Powrót do strony głównej</Link>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-7 w-7"
            onClick={() => setVisible(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
