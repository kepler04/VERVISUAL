import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SYSTEMS, getSystem, countLeaves } from "@/lib/anatomy-data";
import { SystemIcon } from "@/components/SystemIcon";
import { AnatomyExplorer } from "@/components/AnatomyExplorer";

export function generateStaticParams() {
  return SYSTEMS.map((s) => ({ system: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ system: string }>;
}): Promise<Metadata> {
  const { system } = await params;
  const data = getSystem(system);
  if (!data) return { title: "Sistema no encontrado · VetVisual Learning" };
  return { title: `${data.name} · VetVisual Learning` };
}

export default async function SystemPage({
  params,
}: {
  params: Promise<{ system: string }>;
}) {
  const { system } = await params;
  const data = getSystem(system);
  if (!data) notFound();

  const count = countLeaves(data.children);
  const index = SYSTEMS.findIndex((s) => s.slug === data.slug);

  // Sistemas adyacentes para la navegación anterior / siguiente.
  const prev = index > 0 ? SYSTEMS[index - 1] : null;
  const next = index < SYSTEMS.length - 1 ? SYSTEMS[index + 1] : null;

  return (
    <main className="min-h-screen">
      {/* ── Header ── */}
      <header className="border-b border-surgical-900/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
          <Link
            href="/anatomy"
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
            Anatomía Veterinaria
          </Link>
          <span className="font-display text-base font-medium tracking-tight text-ink/80">
            VetVisual Learning
          </span>
        </div>
      </header>

      {/* ── Título del sistema ── */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-8 sm:px-10 sm:pt-16">
        <div className="flex items-start gap-5 animate-fade-up">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-surgical-700 text-paper shadow-plate">
            <span className="h-8 w-8">
              <SystemIcon name={data.icon} />
            </span>
          </span>
          <div>
            <p className="mb-2 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-dark">
              <span className="tabular">
                Bloque {String(index + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-6 bg-amber-dark/40" />
              <span className="tabular">{count} estructuras</span>
            </p>
            <h1 className="text-balance text-4xl font-medium leading-[1.05] text-ink sm:text-5xl">
              {data.name}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink/65">
              {data.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── Explorador ── */}
      <section
        className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 animate-fade-up"
        style={{ animationDelay: "120ms" }}
      >
        <AnatomyExplorer system={data} />
      </section>

      {/* ── Navegación entre sistemas ── */}
      <nav
        aria-label="Navegación entre sistemas"
        className="mx-auto max-w-6xl px-6 pb-24 sm:px-10"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Anterior */}
          {prev ? (
            <Link
              href={`/anatomy/${prev.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-surgical-900/10 bg-paper p-5 shadow-plate transition-all duration-300 hover:-translate-y-0.5 hover:border-surgical-700/30 hover:shadow-plate-hover"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surgical-50 text-surgical-600 transition-colors group-hover:bg-surgical-700 group-hover:text-paper">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-5 w-5">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium uppercase tracking-widest text-ink/40">
                  Sistema anterior
                </span>
                <span className="block truncate font-display text-lg font-medium text-ink">
                  {prev.name}
                </span>
              </span>
            </Link>
          ) : (
            <span aria-hidden className="hidden sm:block" />
          )}

          {/* Siguiente */}
          {next ? (
            <Link
              href={`/anatomy/${next.slug}`}
              className="group flex items-center justify-end gap-4 rounded-2xl border border-surgical-900/10 bg-paper p-5 text-right shadow-plate transition-all duration-300 hover:-translate-y-0.5 hover:border-surgical-700/30 hover:shadow-plate-hover"
            >
              <span className="min-w-0">
                <span className="block text-xs font-medium uppercase tracking-widest text-ink/40">
                  Sistema siguiente
                </span>
                <span className="block truncate font-display text-lg font-medium text-ink">
                  {next.name}
                </span>
              </span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surgical-50 text-surgical-600 transition-colors group-hover:bg-surgical-700 group-hover:text-paper">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-5 w-5">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ) : (
            <span aria-hidden className="hidden sm:block" />
          )}
        </div>
      </nav>

      {/* ── Footer ── */}
      <footer className="border-t border-surgical-900/10">
        <div className="mx-auto flex flex-col items-center gap-2 px-6 py-8 text-center text-xs text-ink/45 sm:px-10">
          <span className="plate-rule h-px w-24 text-surgical-900/20" />
          <p className="font-display text-sm italic text-surgical-600">
            Creado para mejoras de estudio de mi cochongita 💛
          </p>
          <span className="text-ink/35">VetVisual Learning · © 2026</span>
        </div>
      </footer>
    </main>
  );
}
