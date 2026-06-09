import Link from "next/link";
import { SYSTEMS, countLeaves } from "@/lib/anatomy-data";
import { SystemIcon } from "@/components/SystemIcon";

export default function AnatomyPage() {
  return (
    <main className="min-h-screen">
      {/* ── Header ── */}
      <header className="border-b border-surgical-900/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-medium text-ink/70 transition-colors hover:text-surgical-700"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
            >
              <path
                d="M20 12H5m0 0 6-6m-6 6 6 6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Volver al inicio
          </Link>
          <span className="font-display text-base font-medium tracking-tight text-ink/80">
            VetVisual Learning
          </span>
        </div>
      </header>

      {/* ── Título ── */}
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-10 sm:px-10 sm:pt-20">
        <p className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-dark animate-fade-up">
          <span className="h-px w-8 bg-amber-dark" />
          Módulo 01
        </p>
        <h1 className="text-balance text-5xl font-medium leading-[1.05] text-ink animate-fade-up sm:text-6xl">
          Anatomía Veterinaria
        </h1>
        <p
          className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70 animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          Explora la anatomía animal por regiones y sistemas. Cada bloque abre un
          índice detallado de sus estructuras.
        </p>
      </section>

      {/* ── Grid de sistemas ── */}
      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10">
        <div className="mb-8 flex items-end justify-between border-b border-surgical-900/10 pb-4">
          <h2 className="text-2xl font-medium text-ink">Regiones y sistemas</h2>
          <span className="tabular text-sm text-ink/50">{SYSTEMS.length} bloques</span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SYSTEMS.map((sys, i) => {
            const count = countLeaves(sys.children);
            return (
              <Link
                key={sys.slug}
                href={`/anatomy/${sys.slug}`}
                className="group relative flex flex-col items-start overflow-hidden rounded-2xl border border-surgical-900/10 bg-paper p-6 text-left shadow-plate transition-all duration-300 hover:-translate-y-1 hover:border-surgical-700/30 hover:shadow-plate-hover animate-fade-up"
                style={{ animationDelay: `${120 + i * 60}ms` }}
              >
                <span className="tabular absolute right-5 top-5 text-xs font-medium text-ink/25">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="grid h-14 w-14 place-items-center rounded-xl bg-surgical-50 text-surgical-600 transition-colors duration-300 group-hover:bg-surgical-700 group-hover:text-paper">
                  <span className="h-7 w-7">
                    <SystemIcon name={sys.icon} />
                  </span>
                </span>

                <h3 className="mt-6 text-lg font-medium leading-tight text-ink">
                  {sys.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/55">
                  {sys.description}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surgical-900/5 px-2.5 py-1 text-xs font-medium text-surgical-700">
                    <span className="tabular">{count}</span> estructuras
                  </span>
                  <span className="ml-auto flex items-center gap-1 text-sm font-medium text-surgical-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Explorar
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path
                        d="M4 12h15m0 0-6-6m6 6-6 6"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                <span className="mt-5 h-px w-full origin-left scale-x-0 bg-surgical-700/30 transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
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
