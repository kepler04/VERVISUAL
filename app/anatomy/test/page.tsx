"use client";

import { useState } from "react";
import Link from "next/link";
import { SYSTEMS } from "@/lib/anatomy-data";
import { SystemIcon } from "@/components/SystemIcon";
import { TestQuiz } from "@/components/TestQuiz";

export default function TestPage() {
  // null = aún eligiendo; "" = general (todos); slug = un sistema
  const [seleccion, setSeleccion] = useState<string | null>(null);

  return (
    <main className="min-h-screen">
      {/* ── Header ── */}
      <header className="border-b border-surgical-900/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 sm:px-10">
          <Link
            href="/anatomy"
            className="group flex items-center gap-2 text-sm font-medium text-ink/70 transition-colors hover:text-surgical-700"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1">
              <path d="M20 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Anatomía Veterinaria
          </Link>
          <span className="font-display text-base font-medium tracking-tight text-ink/80">
            VetVisual Learning
          </span>
        </div>
      </header>

      {/* ── Título ── */}
      <section className="mx-auto max-w-5xl px-6 pt-12 pb-8 sm:px-10 sm:pt-16">
        <p className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-dark">
          <span className="h-px w-8 bg-amber-dark" />
          Modo Test
        </p>
        <h1 className="text-balance text-4xl font-medium leading-[1.05] text-ink sm:text-5xl">
          Reconocimiento de imágenes
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/65">
          Observa la imagen y elige la estructura correcta. Las preguntas se
          generan a partir de las láminas que has cargado.
        </p>
      </section>

      {/* ── Contenido ── */}
      <section className="mx-auto max-w-5xl px-6 pb-24 sm:px-10">
        {seleccion === null ? (
          <div>
            <h2 className="mb-5 text-lg font-medium text-ink">Elige tu test</h2>

            {/* Test general */}
            <button
              type="button"
              onClick={() => setSeleccion("")}
              className="group mb-5 flex w-full items-center gap-4 rounded-2xl border border-surgical-700/20 bg-surgical-700 p-6 text-left text-paper shadow-plate transition-all duration-300 hover:-translate-y-0.5 hover:shadow-plate-hover"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-paper/15">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className="h-6 w-6">
                  <path d="M3 12h4l3 8 4-16 3 8h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="flex-1">
                <span className="block font-display text-xl font-medium">Test general</span>
                <span className="block text-sm text-paper/75">
                  Imágenes mezcladas de todos los sistemas.
                </span>
              </span>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1">
                <path d="M4 12h15m0 0-6-6m6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Por sistema */}
            <h3 className="mb-3 text-sm font-medium uppercase tracking-widest text-ink/40">
              O por sistema
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SYSTEMS.map((sys) => (
                <button
                  key={sys.slug}
                  type="button"
                  onClick={() => setSeleccion(sys.slug)}
                  className="group flex items-center gap-3 rounded-2xl border border-surgical-900/10 bg-paper p-4 text-left shadow-plate transition-all duration-300 hover:-translate-y-0.5 hover:border-surgical-700/30 hover:shadow-plate-hover"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surgical-50 text-surgical-600 transition-colors group-hover:bg-surgical-700 group-hover:text-paper">
                    <span className="h-5 w-5">
                      <SystemIcon name={sys.icon} />
                    </span>
                  </span>
                  <span className="min-w-0 text-sm font-medium text-ink">{sys.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setSeleccion(null)}
              className="mb-5 flex items-center gap-2 text-sm font-medium text-ink/60 transition-colors hover:text-surgical-700"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-4 w-4">
                <path d="M20 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Cambiar test
            </button>
            <TestQuiz systemSlug={seleccion || undefined} />
          </div>
        )}
      </section>

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
