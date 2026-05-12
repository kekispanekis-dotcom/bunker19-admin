import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f3f8f1] text-[#103820]">
      <header className="border-b border-black/5 bg-white/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-40 overflow-hidden rounded-2xl border border-black/10 bg-white">
              <Image
                src="/logo.png"
                alt="Bunker 19"
                fill
                className="object-contain p-2"
                priority
              />
            </div>

            <div>
              <div className="text-sm font-black uppercase tracking-[0.35em] text-[#1f5c3f]">
                Bunker 19 Admin
              </div>
              <div className="text-xs text-[#5d6f63]">
                Panel interno · Operación · Agenda
              </div>
            </div>
          </div>

          <div className="hidden rounded-full bg-[#eaf6e8] px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#1f5c3f] md:block">
            Plataforma interna
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-9">
        <div className="grid gap-8 overflow-hidden rounded-[32px] bg-[#1f5c3f] p-8 text-white shadow-2xl lg:grid-cols-[1.1fr_.9fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-black">
              Bunker 19 · Social Club
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[1.02] tracking-tight md:text-6xl">
              Reservaciones y operación en un solo sistema
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90">
              Controla agenda, clientes, horarios, cambios de bahía y operación
              diaria de forma clara, moderna y lista para crecer.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/admin"
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 font-black text-white transition hover:bg-white/20"
              >
                Abrir admin
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-white md:h-72">
              <Image
                src="/logo.png"
                alt="Bunker 19 Social Club"
                fill
                className="object-contain p-10"
                priority
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="rounded-[28px] bg-white p-6 shadow-xl">
            <h3 className="text-2xl font-black text-[#1f5c3f]">Reservas</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#5d6f63]">
              Consulta disponibilidad real, selecciona bahía y administra las
              reservas desde el panel interno.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-xl">
            <h3 className="text-2xl font-black text-[#1f5c3f]">Operación</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#5d6f63]">
              Administra check-in, cancelaciones, no-show, cambios de horario y
              movimiento entre bahías.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-xl">
            <h3 className="text-2xl font-black text-[#1f5c3f]">Timeline</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#5d6f63]">
              Visualiza la agenda del día en formato profesional, por hora y por
              bahía.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}