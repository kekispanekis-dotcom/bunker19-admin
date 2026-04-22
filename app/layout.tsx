import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Bunker 19",
  description: "Bunker 19 Social Club · Reservaciones y operación",
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
          <header className="sticky top-0 z-50 border-b border-[rgba(31,92,63,0.10)] bg-[rgba(255,255,255,0.82)] backdrop-blur-2xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 md:px-6 lg:px-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Link href="/" className="flex items-center gap-4">
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
                      Bunker 19
                    </div>
                    <div className="text-xs text-[#6b7c70]">
                      Reservaciones · Admin · Operación
                    </div>
                  </div>
                </Link>

                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  <div className="inline-flex items-center rounded-full border border-[rgba(31,92,63,0.10)] bg-[#eef7eb] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#1f5c3f]">
                    Social Club
                  </div>

                  <Link
                    href="/"
                    className="rounded-xl border border-[rgba(31,92,63,0.10)] bg-white px-4 py-2 text-sm font-semibold text-[#1f5c3f] transition hover:bg-[#f4faf2]"
                  >
                    Inicio
                  </Link>

                  <Link
                    href="/reserve"
                    className="rounded-xl border border-[rgba(31,92,63,0.10)] bg-white px-4 py-2 text-sm font-semibold text-[#1f5c3f] transition hover:bg-[#f4faf2]"
                  >
                    Reservas
                  </Link>

                  <Link
                    href="/admin"
                    className="rounded-xl bg-[linear-gradient(135deg,#1f5c3f,#2d7a54)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(31,92,63,0.18)] transition hover:opacity-95"
                  >
                    Admin
                  </Link>
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