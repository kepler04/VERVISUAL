"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { todasLasEstructuras, type EstructuraPlana } from "@/lib/anatomy-data";

/** Normaliza para comparar sin acentos ni mayúsculas. */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function BuscadorEstructuras() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const todas = useMemo(() => todasLasEstructuras(), []);

  const resultados = useMemo(() => {
    const term = norm(q.trim());
    if (term.length < 2) return [];
    return todas
      .filter((e) => norm(e.name).includes(term))
      .slice(0, 8);
  }, [q, todas]);

  function ir(e: EstructuraPlana) {
    // Lleva al sistema con la estructura preseleccionada vía ?sel=
    router.push(`/anatomy/${e.systemSlug}?sel=${encodeURIComponent(e.path)}`);
    setQ("");
    setAbierto(false);
  }

  function onKeyDown(ev: React.KeyboardEvent) {
    if (!resultados.length) return;
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setActivo((a) => (a + 1) % resultados.length);
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setActivo((a) => (a - 1 + resultados.length) % resultados.length);
    } else if (ev.key === "Enter") {
      ev.preventDefault();
      ir(resultados[activo]);
    } else if (ev.key === "Escape") {
      setAbierto(false);
    }
  }

  return (
    <div ref={boxRef} className="relative">
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className="h-5 w-5">
            <circle cx="11" cy="11" r="7" stroke="currentColor" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setAbierto(true);
            setActivo(0);
          }}
          onFocus={() => setAbierto(true)}
          onBlur={() => setTimeout(() => setAbierto(false), 150)}
          onKeyDown={onKeyDown}
          placeholder="Buscar una estructura… (ej. infundíbulo, colon, riñón)"
          className="w-full rounded-2xl border border-surgical-900/15 bg-paper py-3.5 pl-12 pr-4 text-sm text-ink shadow-plate outline-none transition-colors placeholder:text-ink/40 focus:border-surgical-500"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setAbierto(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
            aria-label="Limpiar"
          >
            ✕
          </button>
        )}
      </div>

      {/* Resultados */}
      {abierto && resultados.length > 0 && (
        <ul className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-surgical-900/10 bg-paper shadow-plate-hover">
          {resultados.map((e, i) => (
            <li key={e.path}>
              <button
                type="button"
                onMouseDown={(ev) => ev.preventDefault()}
                onClick={() => ir(e)}
                onMouseEnter={() => setActivo(i)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === activo ? "bg-surgical-50" : "hover:bg-surgical-900/[0.03]"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink">
                    {e.name}
                  </span>
                  <span className="block truncate text-xs text-ink/45">
                    {e.systemName}
                    {/* migas intermedias: quita slug y nombre final */}
                    {e.path.split("/").slice(1, -1).length > 0 && (
                      <> · {e.path.split("/").slice(1, -1).join(" / ")}</>
                    )}
                  </span>
                </span>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-4 w-4 shrink-0 text-surgical-500">
                  <path d="M4 12h15m0 0-6-6m6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Sin resultados */}
      {abierto && q.trim().length >= 2 && resultados.length === 0 && (
        <div className="absolute z-30 mt-2 w-full rounded-2xl border border-surgical-900/10 bg-paper px-4 py-3 text-sm text-ink/50 shadow-plate-hover">
          Sin coincidencias para “{q}”.
        </div>
      )}
    </div>
  );
}
