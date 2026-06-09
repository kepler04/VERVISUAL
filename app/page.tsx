import Link from "next/link";

/* ── Íconos SVG inline (trazo fino, estilo lámina técnica) ───────────── */

function IconAnatomy() {
  // Esqueleto / hueso estilizado
  return (
    <svg viewBox="0 0 32 32" fill="none" strokeWidth="1.6" aria-hidden="true">
      <path
        d="M9 9.5a2.8 2.8 0 1 0-2.4-4.2M9 9.5l13.5 13.5M9 9.5A2.8 2.8 0 1 1 4.8 7.1M22.5 23a2.8 2.8 0 1 0 4.2 2.4M22.5 23a2.8 2.8 0 1 1 2.4 4.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconHistology() {
  return (
    <svg viewBox="0 0 32 32" fill="none" strokeWidth="1.6" aria-hidden="true">
      <circle cx="11" cy="12" r="5.5" stroke="currentColor" />
      <circle cx="11" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="22" cy="20" r="4.5" stroke="currentColor" />
      <circle cx="22" cy="20" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconMicrobiology() {
  return (
    <svg viewBox="0 0 32 32" fill="none" strokeWidth="1.6" aria-hidden="true">
      <path
        d="M10 6c-3 3 4 8 0 12s3 9 6 8 8-6 5-11-8-12-11-9Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="13" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconParasitology() {
  return (
    <svg viewBox="0 0 32 32" fill="none" strokeWidth="1.6" aria-hidden="true">
      <path
        d="M8 22c4 2 6-2 8-4s4-6 8-4M8 22c-2-1-2-4 0-5s4 1 4 1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="14" r="2.6" stroke="currentColor" />
    </svg>
  );
}

function IconPathology() {
  return (
    <svg viewBox="0 0 32 32" fill="none" strokeWidth="1.6" aria-hidden="true">
      <path
        d="M16 6v8m0 0 5 5a4 4 0 1 1-5.6 0L16 14Zm0 0-5 5a4 4 0 1 0 5.6 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 6h10" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" />
      <path
        d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path
        d="M4 12h15m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Datos de módulos ────────────────────────────────────────────────── */

const lockedModules = [
  { name: "Histología", icon: IconHistology, desc: "Tejidos y estructuras celulares" },
  { name: "Microbiología", icon: IconMicrobiology, desc: "Bacterias, virus y hongos" },
  { name: "Parasitología", icon: IconParasitology, desc: "Parásitos internos y externos" },
  { name: "Patología", icon: IconPathology, desc: "Procesos y lesiones de la enfermedad" },
];

/* ── Página ──────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ── Header ── */}
      <header className="border-b border-surgical-900/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-surgical-700 text-paper shadow-plate">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth="1.8">
                <path
                  d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                />
                <path d="M12 11.5v3M10.5 13h3" stroke="currentColor" strokeLinecap="round" />
              </svg>
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg font-medium tracking-tight text-ink">
                VetVisual Learning
              </p>
            </div>
          </div>
          <span className="hidden rounded-full border border-surgical-900/15 px-3 py-1 text-xs font-medium uppercase tracking-widest text-surgical-700 sm:block">
            Beta
          </span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 sm:px-10 sm:pt-24">
        <div className="max-w-3xl">
          <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-dark animate-fade-up">
            <span className="h-px w-8 bg-amber-dark" />
            Plataforma educativa
          </p>
          <h1 className="text-balance text-5xl font-medium leading-[1.05] text-ink animate-fade-up sm:text-6xl md:text-7xl">
            Aprendizaje visual en{" "}
            <span className="italic text-surgical-600">ciencias veterinarias</span>
          </h1>
          <p
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70 animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            Estudia los sistemas del cuerpo animal mediante láminas interactivas,
            preguntas guiadas y módulos diseñados para fijar el conocimiento.
          </p>
        </div>
      </section>

      {/* ── Módulos ── */}
      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10">
        <div className="mb-8 flex items-end justify-between border-b border-surgical-900/10 pb-4">
          <h2 className="text-2xl font-medium text-ink">Módulos disponibles</h2>
          <span className="tabular text-sm text-ink/50">01 / 05</span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card activa: Anatomía */}
          <Link
            href="/anatomy"
            className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-surgical-700/20 bg-surgical-700 p-7 text-paper shadow-plate transition-all duration-300 hover:-translate-y-1 hover:shadow-plate-hover sm:col-span-2 lg:row-span-2 lg:col-span-1 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            {/* Patrón decorativo de fondo */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="relative">
              <div className="flex items-start justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-paper/15 text-paper backdrop-blur">
                  <span className="h-7 w-7">
                    <IconAnatomy />
                  </span>
                </span>
                <span className="tabular text-xs font-medium uppercase tracking-widest text-paper/60">
                  01
                </span>
              </div>
              <h3 className="mt-7 font-display text-3xl font-medium leading-tight text-paper">
                Anatomía
                <br />
                Veterinaria
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/75">
                Recorre los ocho sistemas del cuerpo animal con preguntas visuales
                por cada estructura.
              </p>
            </div>
            <div className="relative mt-8 flex items-center gap-2 rounded-xl bg-paper px-5 py-3 text-sm font-semibold text-surgical-800 transition-colors group-hover:bg-amber-light">
              Comenzar
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <IconArrow />
              </span>
            </div>
          </Link>

          {/* Cards bloqueadas */}
          {lockedModules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.name}
                aria-disabled="true"
                className="group relative flex flex-col rounded-2xl border border-surgical-900/10 bg-paper-dark/40 p-7 animate-fade-up"
                style={{ animationDelay: `${260 + i * 70}ms` }}
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-xl bg-surgical-900/5 text-surgical-700/40">
                    <span className="h-7 w-7">
                      <Icon />
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-amber/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-dark">
                    Próximamente
                  </span>
                </div>
                <h3 className="mt-7 text-xl font-medium text-ink/45">{mod.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/35">{mod.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-ink/30">
                  <span className="h-4 w-4">
                    <IconLock />
                  </span>
                  Bloqueado
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-surgical-900/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-ink/45 sm:px-10">
          <span>VetVisual Learning</span>
          <span className="plate-rule h-px w-24 text-surgical-900/20" />
          <span>© 2026</span>
        </div>
      </footer>
    </main>
  );
}
