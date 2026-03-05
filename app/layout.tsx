"use client";

import "./globals.css";
import { Toaster } from "react-hot-toast";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="pt_br">
      <head>
        <link rel="icon" type="image/jpg" href="/ico.jpg" />
        <title>Contagem de Oração</title>
      </head>
      <body className="relative min-h-screen">
        <AnimatedBackground />
        <Toaster position="top-right" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}