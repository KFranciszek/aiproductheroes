import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Badge Component - Stitch Dashboard Style
 * Minimalne użycie koloru, profesjonalny wygląd
 * Status badges z subtelnymi kolorami
 */

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-fast",
  {
    variants: {
      variant: {
        // Default - neutralny (Stitch style)
        default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        
        // Primary - niebieski akcent (jak w Stitch)
        primary: "bg-primary/20 text-primary",
        
        // Destructive - czerwony (krytyczne błędy)
        destructive: "bg-error/20 text-error",
        
        // Outline - ghost style
        outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
        
        // Secondary - subtle
        secondary: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
        
        // Status badges - Linear style (mniej żywe kolory)
        "in-progress": "bg-primary/10 text-primary",
        "completed": "bg-green-600/15 text-green-600",
        "planning": "bg-yellow-600/15 text-yellow-600",
        
        // Legacy compatibility
        success: "bg-green-600/15 text-green-600",
        info: "bg-primary/10 text-primary",
        warning: "bg-yellow-600/15 text-yellow-600",
        danger: "bg-error/20 text-error",
        neutral: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        p0: "bg-error/20 text-error",
        p1: "bg-yellow-600/15 text-yellow-600",
        p2: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
