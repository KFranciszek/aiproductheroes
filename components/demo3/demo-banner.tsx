"use client"

import { AlertCircle, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/demo3/ui/alert"
import { Button } from "@/components/demo3/ui/button"
import Link from "next/link"
import { useState } from "react"

export function DemoBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <Alert className="sticky top-0 z-50 rounded-none border-x-0 border-t-0 bg-primary/10 text-primary dark:bg-primary/20">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <span className="text-sm">
          You are in <strong>Demo Mode</strong>. All data is simulated and will reset on refresh.{" "}
          <Link href="/" className="underline underline-offset-4 hover:text-primary/80">
            Back to Home
          </Link>
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={() => setVisible(false)}
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
