import type { Metadata } from "next";
import Link from "next/link";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "mi_producto",
  description: "Entiende tu publicidad de Google Ads con reportes simples por WhatsApp."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.14),_transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef6f7_100%)]">
          <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
                mi_producto
              </Link>
              <nav className="flex items-center gap-6 text-sm text-slate-600">
                <Link href="/pricing">Planes</Link>
                <Link href="/faq">FAQ</Link>
                <Link href="/login">Ingresar</Link>
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
