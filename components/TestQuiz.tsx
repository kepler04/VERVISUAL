"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase, supabaseConfigured, CONTENIDO_TABLE } from "@/lib/supabase";
import { todasLasEstructuras, type EstructuraPlana } from "@/lib/anatomy-data";

/* ── Tipos ───────────────────────────────────────────────────────────── */

type ItemConImagen = EstructuraPlana & { imagen: string };

type Pregunta = {
  imagen: string;
  correcta: ItemConImagen;
  opciones: ItemConImagen[]; // incluye la correcta, ya barajadas
};

/* ── Utilidades ──────────────────────────────────────────────────────── */

function barajar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Construye las preguntas: una por cada imagen disponible. Los distractores se
 * eligen entre ESTRUCTURAS ÚNICAS (por path) del mismo sistema; si no hay
 * suficientes, se completan con otras. Siempre 4 opciones sin duplicados.
 */
function construirPreguntas(items: ItemConImagen[]): Pregunta[] {
  const preguntas: Pregunta[] = [];

  // Catálogo de estructuras únicas por path (una sola entrada aunque tenga
  // varias imágenes), para usarlo como pozo de distractores sin repetidos.
  const unicasPorPath = new Map<string, ItemConImagen>();
  for (const it of items) {
    if (!unicasPorPath.has(it.path)) unicasPorPath.set(it.path, it);
  }
  const unicas = [...unicasPorPath.values()];

  for (const item of items) {
    // Distractores: estructuras únicas, mismo sistema, distinto path.
    const mismoSistema = unicas.filter(
      (x) => x.systemSlug === item.systemSlug && x.path !== item.path,
    );
    let distractores = barajar(mismoSistema).slice(0, 3);

    // Completar con estructuras de otros sistemas si faltan.
    if (distractores.length < 3) {
      const otros = barajar(
        unicas.filter(
          (x) =>
            x.path !== item.path && !distractores.some((d) => d.path === x.path),
        ),
      );
      distractores = [...distractores, ...otros].slice(0, 3);
    }

    const opciones = barajar([item, ...distractores]);
    preguntas.push({ imagen: item.imagen, correcta: item, opciones });
  }

  return barajar(preguntas);
}

/* ── Componente ──────────────────────────────────────────────────────── */

export function TestQuiz({
  systemSlug,
}: {
  /** Si se pasa, el test es solo de ese sistema; si no, general. */
  systemSlug?: string;
}) {
  const [items, setItems] = useState<ItemConImagen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado del quiz
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [idx, setIdx] = useState(0);
  const [elegida, setElegida] = useState<string | null>(null); // path elegido
  const [aciertos, setAciertos] = useState(0);
  const [terminado, setTerminado] = useState(false);

  /* ── Cargar estructuras con imágenes desde Supabase ── */
  useEffect(() => {
    if (!supabaseConfigured) {
      setError("Conexión a Supabase no configurada.");
      setLoading(false);
      return;
    }
    let cancelado = false;
    setLoading(true);

    supabase
      .from(CONTENIDO_TABLE)
      .select("path, imagenes, imagenes_excluidas")
      .then(({ data, error }) => {
        if (cancelado) return;
        if (error) {
          setError("No se pudieron cargar los datos del test.");
          setLoading(false);
          return;
        }

        // Mapa path → nombre + sistema
        const planas = todasLasEstructuras();
        const porPath = new Map(planas.map((p) => [p.path, p]));

        const conImagen: ItemConImagen[] = [];
        for (const fila of data ?? []) {
          const imgs: string[] = Array.isArray(fila.imagenes) ? fila.imagenes : [];
          if (imgs.length === 0) continue;
          const excluidas: string[] = Array.isArray(fila.imagenes_excluidas)
            ? fila.imagenes_excluidas
            : [];
          const meta = porPath.get(fila.path);
          if (!meta) continue;
          if (systemSlug && meta.systemSlug !== systemSlug) continue;
          // Una entrada por imagen NO excluida (cada una es una pregunta).
          for (const img of imgs) {
            if (excluidas.includes(img)) continue;
            conImagen.push({ ...meta, imagen: img });
          }
        }

        setItems(conImagen);
        setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [systemSlug]);

  const iniciar = useCallback(() => {
    setPreguntas(construirPreguntas(items));
    setIdx(0);
    setElegida(null);
    setAciertos(0);
    setTerminado(false);
  }, [items]);

  const preguntaActual = preguntas[idx];

  function responder(pathElegido: string) {
    if (elegida) return; // ya respondió esta pregunta
    setElegida(pathElegido);
    if (pathElegido === preguntaActual.correcta.path) {
      setAciertos((a) => a + 1);
    }
  }

  function siguiente() {
    if (idx + 1 >= preguntas.length) {
      setTerminado(true);
    } else {
      setIdx((i) => i + 1);
      setElegida(null);
    }
  }

  const totalDisponibles = items.length;

  /* ── Render: estados ── */

  if (loading) {
    return (
      <div className="rounded-2xl border border-surgical-900/10 bg-paper p-10 text-center text-sm text-ink/50 shadow-plate">
        Cargando banco de imágenes…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-300 bg-red-50 p-8 text-center text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (totalDisponibles === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-surgical-900/15 bg-paper-dark/30 p-10 text-center">
        <p className="text-base font-medium text-ink">
          Aún no hay imágenes para el test
        </p>
        <p className="mt-2 text-sm text-ink/55">
          {systemSlug
            ? "Este sistema todavía no tiene estructuras con imágenes. Sube algunas en modo edición."
            : "Sube imágenes a las estructuras (en modo edición) para generar preguntas."}
        </p>
      </div>
    );
  }

  /* ── Render: pantalla de inicio ── */
  if (preguntas.length === 0) {
    return (
      <div className="rounded-2xl border border-surgical-900/10 bg-paper p-8 text-center shadow-plate sm:p-12">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-surgical-700 text-paper">
          <svg viewBox="0 0 48 48" fill="none" strokeWidth="1.6" className="h-8 w-8">
            <rect x="6" y="8" width="28" height="22" rx="3" stroke="currentColor" />
            <circle cx="14" cy="16" r="2.5" stroke="currentColor" />
            <path d="M34 26l-7-7-13 11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="34" cy="34" r="9" stroke="currentColor" />
            <path d="M40 40l4 4" stroke="currentColor" strokeLinecap="round" />
          </svg>
        </span>
        <h2 className="mt-5 font-display text-2xl font-medium text-ink">
          ¿List@ para el test?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/60">
          Se mostrará una imagen y deberás elegir a qué estructura corresponde.
          Banco disponible: <span className="font-semibold tabular text-surgical-700">{totalDisponibles}</span>{" "}
          {totalDisponibles === 1 ? "imagen" : "imágenes"}.
        </p>
        <button
          type="button"
          onClick={iniciar}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-surgical-700 px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-surgical-800"
        >
          Comenzar test
        </button>
      </div>
    );
  }

  /* ── Render: resultado final ── */
  if (terminado) {
    const pct = Math.round((aciertos / preguntas.length) * 100);
    return (
      <div className="rounded-2xl border border-surgical-900/10 bg-paper p-8 text-center shadow-plate sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-dark">
          Resultado
        </p>
        <p className="mt-3 font-display text-5xl font-medium text-ink">
          <span className="tabular">{aciertos}</span>
          <span className="text-ink/30"> / {preguntas.length}</span>
        </p>
        <p className="mt-2 text-sm text-ink/60">
          {pct}% de aciertos.{" "}
          {pct === 100
            ? "¡Perfecto! 🎉"
            : pct >= 70
              ? "¡Muy bien! 💪"
              : "Sigue practicando 📚"}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={iniciar}
            className="inline-flex items-center gap-2 rounded-xl bg-surgical-700 px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-surgical-800"
          >
            Repetir test
          </button>
          <Link
            href="/anatomy"
            className="inline-flex items-center gap-2 rounded-xl border border-surgical-900/15 px-5 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:border-surgical-700/30 hover:text-surgical-700"
          >
            Volver a Anatomía
          </Link>
        </div>
      </div>
    );
  }

  /* ── Render: pregunta activa ── */
  const respondida = elegida !== null;

  return (
    <div className="rounded-2xl border border-surgical-900/10 bg-paper p-5 shadow-plate sm:p-7">
      {/* Progreso */}
      <div className="mb-4 flex items-center justify-between text-xs text-ink/50">
        <span className="tabular font-medium">
          Pregunta {idx + 1} / {preguntas.length}
        </span>
        <span className="tabular">Aciertos: {aciertos}</span>
      </div>
      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-surgical-900/10">
        <div
          className="h-full rounded-full bg-surgical-600 transition-all duration-300"
          style={{ width: `${((idx + (respondida ? 1 : 0)) / preguntas.length) * 100}%` }}
        />
      </div>

      {/* Imagen */}
      <div className="overflow-hidden rounded-xl border border-surgical-900/10 bg-ink/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preguntaActual.imagen}
          alt="Estructura a identificar"
          className="mx-auto max-h-[46vh] w-full object-contain"
        />
      </div>

      <p className="mt-5 text-center text-sm font-medium text-ink">
        ¿Qué estructura es esta?
      </p>
      {!systemSlug && (
        <p className="mt-1 text-center text-xs text-ink/45">
          Sistema: {preguntaActual.correcta.systemName}
        </p>
      )}

      {/* Opciones */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {preguntaActual.opciones.map((op) => {
          const esCorrecta = op.path === preguntaActual.correcta.path;
          const esElegida = op.path === elegida;

          let estilo =
            "border-surgical-900/15 bg-paper hover:border-surgical-700/40 hover:bg-surgical-50";
          if (respondida) {
            if (esCorrecta) {
              estilo = "border-green-500 bg-green-50 text-green-800";
            } else if (esElegida) {
              estilo = "border-red-400 bg-red-50 text-red-700";
            } else {
              estilo = "border-surgical-900/10 bg-paper opacity-60";
            }
          }

          return (
            <button
              key={op.path}
              type="button"
              disabled={respondida}
              onClick={() => responder(op.path)}
              className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm font-medium text-ink transition-colors ${estilo} disabled:cursor-default`}
            >
              <span>{op.name}</span>
              {respondida && esCorrecta && <span aria-hidden>✓</span>}
              {respondida && esElegida && !esCorrecta && <span aria-hidden>✕</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback + siguiente */}
      {respondida && (
        <div className="mt-5 flex flex-col items-center gap-3 border-t border-surgical-900/10 pt-5">
          <p
            className={`text-sm font-semibold ${
              elegida === preguntaActual.correcta.path
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {elegida === preguntaActual.correcta.path
              ? "¡Correcto! 🎉"
              : `Incorrecto. Era: ${preguntaActual.correcta.name}`}
          </p>
          <button
            type="button"
            onClick={siguiente}
            className="inline-flex items-center gap-2 rounded-xl bg-surgical-700 px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-surgical-800"
          >
            {idx + 1 >= preguntas.length ? "Ver resultado" : "Siguiente pregunta"}
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-4 w-4">
              <path d="M4 12h15m0 0-6-6m6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
