"use client";

import { useEffect, useRef, useState } from "react";
import { useEstructuraContenido } from "@/lib/useEstructuraContenido";

/* ── Iconos ──────────────────────────────────────────────────────────── */

function IconImage() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" />
      <circle cx="8.5" cy="9" r="1.5" stroke="currentColor" />
      <path d="M21 16l-5-5L5 20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M5 12l4.5 4.5L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" className="opacity-20" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Componente ──────────────────────────────────────────────────────── */

export function EstructuraDetalle({
  path,
  name,
  crumbs,
  systemName,
  editMode,
}: {
  path: string;
  name: string;
  crumbs: string[];
  systemName: string;
  editMode: boolean;
}) {
  const {
    descripcion,
    imagenes,
    puntosClave,
    loading,
    saving,
    error,
    configured,
    guardarDescripcion,
    agregarPunto,
    borrarPunto,
    subirImagenes,
    borrarImagen,
  } = useEstructuraContenido(path);

  const [borrador, setBorrador] = useState("");
  const [nuevoPunto, setNuevoPunto] = useState("");
  // Índice de la imagen abierta en el lightbox (null = cerrado).
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Sincroniza el borrador del textarea cuando cambia la estructura/contenido.
  useEffect(() => {
    setBorrador(descripcion);
  }, [descripcion, path]);

  // Navegación del lightbox con teclado (flechas y escape).
  useEffect(() => {
    if (lightboxIdx === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight")
        setLightboxIdx((i) => (i === null ? i : (i + 1) % imagenes.length));
      if (e.key === "ArrowLeft")
        setLightboxIdx((i) =>
          i === null ? i : (i - 1 + imagenes.length) % imagenes.length,
        );
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, imagenes.length]);

  const descripcionCambiada = borrador.trim() !== descripcion.trim();

  async function onSubir(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length) await subirImagenes(files);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onAgregarPunto() {
    if (!nuevoPunto.trim()) return;
    await agregarPunto(nuevoPunto);
    setNuevoPunto("");
  }

  return (
    <div
      key={path}
      className="flex h-full flex-col rounded-2xl border border-surgical-900/10 bg-paper p-8 shadow-plate animate-fade-up"
    >
      {/* Migas + título */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink/45">
        <span className="font-medium text-amber-dark">{systemName}</span>
        {crumbs.map((c, i) => (
          <span key={`${c}-${i}`} className="flex items-center gap-1.5">
            <span className="text-ink/25">/</span>
            {c}
          </span>
        ))}
      </div>
      <h3 className="mt-4 font-display text-3xl font-medium leading-tight text-ink">
        {name}
      </h3>

      {/* Aviso si Supabase no está configurado */}
      {!configured && (
        <p className="mt-5 rounded-lg border border-amber/30 bg-amber/10 px-3 py-2 text-xs text-amber-dark">
          Conexión a Supabase no configurada. Define las variables en
          <code className="mx-1 rounded bg-amber/15 px-1">.env.local</code>.
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-sm text-ink/45">
          <Spinner />
          Cargando contenido…
        </div>
      ) : (
        <div className="mt-6 flex flex-1 flex-col gap-7">
          {/* ── Descripción ── */}
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-surgical-700">
              Descripción
            </h4>
            {editMode ? (
              <div>
                <textarea
                  value={borrador}
                  onChange={(e) => setBorrador(e.target.value)}
                  rows={5}
                  placeholder="Escribe la descripción anatómica de esta estructura…"
                  className="w-full resize-y rounded-xl border border-surgical-900/15 bg-paper-dark/20 p-3 text-sm leading-relaxed text-ink outline-none transition-colors focus:border-surgical-500 focus:bg-paper"
                />
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    disabled={!descripcionCambiada || saving}
                    onClick={() => guardarDescripcion(borrador)}
                    className="inline-flex items-center gap-2 rounded-lg bg-surgical-700 px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-surgical-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {saving && <Spinner />}
                    Guardar descripción
                  </button>
                  {descripcionCambiada && (
                    <button
                      type="button"
                      onClick={() => setBorrador(descripcion)}
                      className="text-sm text-ink/50 hover:text-ink"
                    >
                      Descartar
                    </button>
                  )}
                </div>
              </div>
            ) : descripcion.trim() ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink/75">
                {descripcion}
              </p>
            ) : (
              <p className="text-sm italic text-ink/40">Sin descripción aún.</p>
            )}
          </section>

          {/* ── Cómo identificarla (puntos clave) ── */}
          {(editMode || puntosClave.length > 0) && (
            <section className="rounded-xl border border-amber/25 bg-amber/[0.06] p-4">
              <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-dark">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className="h-4 w-4">
                  <path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5c-.7.6-1 1-1 2v.5H9v-.5c0-1-.3-1.4-1-2A6 6 0 0 1 12 3Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Cómo identificarla
              </h4>

              {puntosClave.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {puntosClave.map((punto, i) => (
                    <li key={`${punto}-${i}`} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/80">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber/20 text-amber-dark">
                        <IconCheck />
                      </span>
                      <span className="flex-1">{punto}</span>
                      {editMode && (
                        <button
                          type="button"
                          onClick={() => borrarPunto(i)}
                          title="Borrar punto"
                          className="mt-0.5 shrink-0 text-ink/30 transition-colors hover:text-red-600"
                        >
                          <IconTrash />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-ink/40">
                  Agrega claves para reconocer esta estructura (color, ubicación, forma…).
                </p>
              )}

              {editMode && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={nuevoPunto}
                    onChange={(e) => setNuevoPunto(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onAgregarPunto();
                      }
                    }}
                    placeholder="Nueva clave de identificación…"
                    className="flex-1 rounded-lg border border-amber/30 bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-amber"
                  />
                  <button
                    type="button"
                    disabled={!nuevoPunto.trim() || saving}
                    onClick={onAgregarPunto}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-dark px-3 py-2 text-sm font-semibold text-paper transition-colors hover:bg-amber disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {saving ? <Spinner /> : "+"} Agregar
                  </button>
                </div>
              )}
            </section>
          )}

          {/* ── Imágenes ── */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-surgical-700">
                Imágenes{" "}
                <span className="tabular text-ink/40">({imagenes.length})</span>
              </h4>
              {editMode && (
                <>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onSubir}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-lg border border-surgical-700/30 bg-surgical-50 px-3 py-1.5 text-sm font-medium text-surgical-700 transition-colors hover:bg-surgical-100 disabled:opacity-40"
                  >
                    {saving ? <Spinner /> : <IconImage />}
                    Agregar imágenes
                  </button>
                </>
              )}
            </div>

            {imagenes.length === 0 ? (
              <p className="text-sm italic text-ink/40">
                {editMode ? "Aún no hay imágenes. Agrega una." : "Sin imágenes aún."}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {imagenes.map((url, i) => (
                  <div
                    key={url}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-surgical-900/10 bg-paper-dark/30"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={name}
                      loading="lazy"
                      onClick={() => setLightboxIdx(i)}
                      className="h-full w-full cursor-zoom-in object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {editMode && (
                      <button
                        type="button"
                        title="Borrar imagen"
                        onClick={() => {
                          if (confirm("¿Borrar esta imagen?")) borrarImagen(url);
                        }}
                        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-ink/70 text-paper opacity-0 backdrop-blur transition-opacity hover:bg-red-600 group-hover:opacity-100"
                      >
                        <IconTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      <div className="mt-auto pt-8">
        <span className="plate-rule block h-px w-full text-surgical-900/15" />
        <p className="mt-3 text-[11px] uppercase tracking-widest text-ink/35">
          Lámina de estudio · VetVisual Learning
        </p>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && imagenes[lightboxIdx] && (
        <div
          onClick={() => setLightboxIdx(null)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-ink/90 p-4 backdrop-blur-sm animate-fade-up sm:p-8"
        >
          {/* Cerrar */}
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-paper/90 text-xl text-ink transition-colors hover:bg-paper sm:right-6 sm:top-6"
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Imagen + flechas */}
          <div
            className="relative flex max-h-[80vh] w-full flex-1 items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {imagenes.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightboxIdx(
                    (lightboxIdx - 1 + imagenes.length) % imagenes.length,
                  )
                }
                className="absolute left-2 z-10 grid h-12 w-12 place-items-center rounded-full bg-paper/90 text-ink transition-colors hover:bg-paper sm:left-4"
                aria-label="Anterior"
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-6 w-6">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagenes[lightboxIdx]}
              alt={name}
              className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
            />

            {imagenes.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightboxIdx((lightboxIdx + 1) % imagenes.length)
                }
                className="absolute right-2 z-10 grid h-12 w-12 place-items-center rounded-full bg-paper/90 text-ink transition-colors hover:bg-paper sm:right-4"
                aria-label="Siguiente"
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-6 w-6">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Pie: nombre + contador + puntos clave */}
          <div
            className="w-full max-w-2xl rounded-2xl bg-paper/95 p-5 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-3">
              <h4 className="font-display text-lg font-medium text-ink">{name}</h4>
              {imagenes.length > 1 && (
                <span className="tabular rounded-full bg-surgical-900/10 px-2.5 py-0.5 text-xs font-medium text-surgical-700">
                  {lightboxIdx + 1} / {imagenes.length}
                </span>
              )}
            </div>
            {puntosClave.length > 0 && (
              <ul className="mt-3 flex flex-wrap justify-center gap-2">
                {puntosClave.map((punto, i) => (
                  <li
                    key={`lb-${i}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1 text-xs text-amber-dark"
                  >
                    <IconCheck />
                    {punto}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
