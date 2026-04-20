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
          <header className="sticky top-0 z-50 border-b border-[rgba(31,92,63,0.10)] bg-[rgba(255,255,255,0.75)] backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative h-12 w-40 overflow-hidden rounded-xl border border-[rgba(31,92,63,0.10)] bg-white">
                  <Image
                    src="/logo-bunker19.png"
                    alt="Bunker 19"
                    fill
                    sizes="160px"
                    className="object-contain p-1"
                    priority
                  />
                </div>
              </Link>

              <nav className="flex flex-wrap items-center gap-2 md:gap-3">
                <Link
                  href="/"
                  className="rounded-xl border border-[rgba(31,92,63,0.10)] bg-white px-4 py-2 text-sm font-semibold text-[#1f5c3f] transition hover:bg-[#f3f8f1]"
                >
                  Inicio
                </Link>
                <Link
                  href="/reserve"
                  className="rounded-xl border border-[rgba(31,92,63,0.10)] bg-white px-4 py-2 text-sm font-semibold text-[#1f5c3f] transition hover:bg-[#f3f8f1]"
                >
                  Reservas
                </Link>
                <Link
                  href="/admin"
                  className="rounded-xl border border-[rgba(31,92,63,0.10)] bg-white px-4 py-2 text-sm font-semibold text-[#1f5c3f] transition hover:bg-[#f3f8f1]"
                >
                  Admin
                </Link>
              </nav>
            </div>
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}