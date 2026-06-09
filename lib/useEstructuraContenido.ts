"use client";

import { useCallback, useEffect, useState } from "react";
import {
  supabase,
  supabaseConfigured,
  CONTENIDO_TABLE,
  BUCKET,
} from "@/lib/supabase";

/**
 * Gestiona el contenido (descripción + imágenes) de una estructura concreta,
 * identificada por su `path` único global (incluye el slug del sistema).
 *
 * Todo se guarda en Supabase: la fila en la tabla `estructura_contenido` y los
 * archivos en el bucket `anatomia`. Sin auth: las escrituras usan la anon key.
 */

export type ContenidoEstructura = {
  descripcion: string;
  imagenes: string[]; // URLs públicas
};

/** Convierte un path con espacios/acentos en una ruta segura para Storage. */
function sanitizarPath(path: string): string {
  return path
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos (diacríticos combinantes)
    .replace(/[^a-zA-Z0-9/_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

/** Extrae la ruta interna del bucket a partir de una URL pública. */
function rutaDesdeUrl(url: string): string | null {
  const marcador = `/object/public/${BUCKET}/`;
  const i = url.indexOf(marcador);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marcador.length));
}

export function useEstructuraContenido(path: string | null) {
  const [descripcion, setDescripcion] = useState("");
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Cargar ── */
  useEffect(() => {
    if (!path || !supabaseConfigured) {
      setDescripcion("");
      setImagenes([]);
      return;
    }
    let cancelado = false;
    setLoading(true);
    setError(null);

    supabase
      .from(CONTENIDO_TABLE)
      .select("descripcion, imagenes")
      .eq("path", path)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelado) return;
        if (error) {
          setError("No se pudo cargar el contenido.");
        } else {
          setDescripcion(data?.descripcion ?? "");
          setImagenes(Array.isArray(data?.imagenes) ? data!.imagenes : []);
        }
        setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [path]);

  /* ── Upsert auxiliar ── */
  const upsert = useCallback(
    async (campos: Partial<ContenidoEstructura>) => {
      if (!path) return;
      const { error } = await supabase
        .from(CONTENIDO_TABLE)
        .upsert(
          { path, ...campos, updated_at: new Date().toISOString() },
          { onConflict: "path" },
        );
      if (error) throw error;
    },
    [path],
  );

  /* ── Guardar descripción ── */
  const guardarDescripcion = useCallback(
    async (texto: string) => {
      if (!path) return;
      setSaving(true);
      setError(null);
      try {
        await upsert({ descripcion: texto });
        setDescripcion(texto);
      } catch {
        setError("No se pudo guardar la descripción.");
      } finally {
        setSaving(false);
      }
    },
    [path, upsert],
  );

  /* ── Subir imágenes ── */
  const subirImagenes = useCallback(
    async (archivos: File[]) => {
      if (!path || archivos.length === 0) return;
      setSaving(true);
      setError(null);
      try {
        const base = sanitizarPath(path);
        const nuevas: string[] = [];

        for (const archivo of archivos) {
          const nombre = `${base}/${Date.now()}-${sanitizarPath(archivo.name)}`;
          const { error: upErr } = await supabase.storage
            .from(BUCKET)
            .upload(nombre, archivo, { upsert: false });
          if (upErr) throw upErr;

          const { data } = supabase.storage.from(BUCKET).getPublicUrl(nombre);
          nuevas.push(data.publicUrl);
        }

        const actualizadas = [...imagenes, ...nuevas];
        await upsert({ imagenes: actualizadas });
        setImagenes(actualizadas);
      } catch {
        setError("No se pudieron subir una o más imágenes.");
      } finally {
        setSaving(false);
      }
    },
    [path, imagenes, upsert],
  );

  /* ── Borrar imagen ── */
  const borrarImagen = useCallback(
    async (url: string) => {
      if (!path) return;
      setSaving(true);
      setError(null);
      try {
        const ruta = rutaDesdeUrl(url);
        if (ruta) {
          await supabase.storage.from(BUCKET).remove([ruta]);
        }
        const actualizadas = imagenes.filter((u) => u !== url);
        await upsert({ imagenes: actualizadas });
        setImagenes(actualizadas);
      } catch {
        setError("No se pudo borrar la imagen.");
      } finally {
        setSaving(false);
      }
    },
    [path, imagenes, upsert],
  );

  return {
    descripcion,
    imagenes,
    loading,
    saving,
    error,
    configured: supabaseConfigured,
    guardarDescripcion,
    subirImagenes,
    borrarImagen,
  };
}
