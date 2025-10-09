import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Syzio Demo2 - Modern Design",
  description: "Ultra-szczegółowy koncept design z naciskiem na dostępność i wydajność",
}

export default function Demo2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


