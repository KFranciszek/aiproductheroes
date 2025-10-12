import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "../demo6-globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Syzio Canis - Demo 6",
  description: "AI-powered intelligent project assistant for Syzio ecosystem",
};

export default function Demo6RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
