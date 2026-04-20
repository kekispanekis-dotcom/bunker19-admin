import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="bunker-page">
      <section className="bunker-hero overflow-hidden p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="bunker-pill bg-white/10 text-white">
              Bunker 19 · Social Club
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Reservaciones y operación en un solo sistema
            </h1>

            <p className="mt-4 max-w-2xl text-sm text-white/85 md:text-base">
              Controla agenda, clientes, horarios, cambios de bahía y operación
              diaria de forma clara, moderna y lista para crecer.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/reserve"
                className="rounded-2xl bg-white px-6 py-3 text-center font-bold text-[#1f5c3f] transition hover:opacity-95"
              >
                Nueva reservación
              </Link>

              <Link
                href="/admin"
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-center font-bold text-white transition hover:bg-white/15"
              >
                Abrir admin
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-white md:h-72">
              <Image
                src="/logo-bunker19.png"
                alt="Bunker 19"
                fill
                sizes="(max-width: 768px) 320px, 520px"
                className="object-contain p-4"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="bunker-card p-6">
          <h2 className="text-xl font-black text-[#1f5c3f]">Reservas</h2>
          <p className="mt-2 text-sm bunker-muted">
            Consulta disponibilidad real, selecciona bahía y cierra una reserva
            en pocos pasos.
          </p>
        </div>

        <div className="bunker-card p-6">
          <h2 className="text-xl font-black text-[#1f5c3f]">Operación</h2>
          <p className="mt-2 text-sm bunker-muted">
            Administra check-in, cancelaciones, no-show, cambios de horario y
            movimiento entre bahías.
          </p>
        </div>

        <div className="bunker-card p-6">
          <h2 className="text-xl font-black text-[#1f5c3f]">Timeline</h2>
          <p className="mt-2 text-sm bunker-muted">
            Visualiza la agenda del día en formato profesional, por hora y por
            bahía.
          </p>
        </div>
      </section>
    </main>
  );
}