import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bunker 19 Admin",
  description: "Panel interno de operación de Bunker 19",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <div className="bunker-shell">
          <header className="sticky top-0 z-50 border-b border-[rgba(31,92,63,0.10)] bg-[rgba(255,255,255,0.88)] backdrop-blur-2xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 md:px-6 lg:px-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Link href="/admin" className="flex items-center gap-4">
                  <div className="relative h-14 w-44 overflow-hidden rounded-2xl border border-[rgba(31,92,63,0.10)] bg-white shadow-[0_10px_24px_rgba(21,32,24,0.08)]">
                    <Image
                      src="/logo-bunker19.png"
                      alt="Bunker 19"
                      fill
                      sizes="176px"
                      className="object-contain p-2"
                      priority
                    />
                  </div>

                  <div className="hidden md:block">
                    <div className="text-sm font-black uppercase tracking-[0.22em] text-[#1f5c3f]">
                      Bunker 19 Admin
                    </div>
                    <div className="text-xs text-[#6b7c70]">
                      Panel interno · Operación · Agenda
                    </div>
                  </div>
                </Link>

                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  <div className="inline-flex items-center rounded-full border border-[rgba(31,92,63,0.10)] bg-[#eef7eb] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#1f5c3f]">
                    Plataforma interna
                  </div>
                </div>
              </div>
            </div>
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}