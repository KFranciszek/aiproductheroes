import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Wybierz Demo - Syzio",
  description: "Wybierz wersję demo do przetestowania różnych podejść UX/UI",
}

export default function DemoSelectorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


