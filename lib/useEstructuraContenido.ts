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
  puntos_clave: string[]; // puntos para identificar la estructura
  imagenes_excluidas: string[]; // URLs que NO deben aparecer en el test
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
  const [puntosClave, setPuntosClave] = useState<string[]>([]);
  const [imagenesExcluidas, setImagenesExcluidas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Cargar ── */
  useEffect(() => {
    if (!path || !supabaseConfigured) {
      setDescripcion("");
      setImagenes([]);
      setPuntosClave([]);
      setImagenesExcluidas([]);
      return;
    }
    let cancelado = false;
    setLoading(true);
    setError(null);

    supabase
      .from(CONTENIDO_TABLE)
      .select("descripcion, imagenes, puntos_clave, imagenes_excluidas")
      .eq("path", path)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelado) return;
        if (error) {
          setError("No se pudo cargar el contenido.");
        } else {
          setDescripcion(data?.descripcion ?? "");
          setImagenes(Array.isArray(data?.imagenes) ? data!.imagenes : []);
          setPuntosClave(
            Array.isArray(data?.puntos_clave) ? data!.puntos_clave : [],
          );
          setImagenesExcluidas(
            Array.isArray(data?.imagenes_excluidas)
              ? data!.imagenes_excluidas
              : [],
          );
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

  /* ── Puntos clave de identificación ── */
  const agregarPunto = useCallback(
    async (texto: string) => {
      if (!path || !texto.trim()) return;
      setSaving(true);
      setError(null);
      try {
        const actualizados = [...puntosClave, texto.trim()];
        await upsert({ puntos_clave: actualizados });
        setPuntosClave(actualizados);
      } catch {
        setError("No se pudo agregar el punto.");
      } finally {
        setSaving(false);
      }
    },
    [path, puntosClave, upsert],
  );

  const borrarPunto = useCallback(
    async (indice: number) => {
      if (!path) return;
      setSaving(true);
      setError(null);
      try {
        const actualizados = puntosClave.filter((_, i) => i !== indice);
        await upsert({ puntos_clave: actualizados });
        setPuntosClave(actualizados);
      } catch {
        setError("No se pudo borrar el punto.");
      } finally {
        setSaving(false);
      }
    },
    [path, puntosClave, upsert],
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

  /* ── Excluir / incluir imagen en el test ── */
  const toggleExcluirImagen = useCallback(
    async (url: string) => {
      if (!path) return;
      setSaving(true);
      setError(null);
      try {
        const estaba = imagenesExcluidas.includes(url);
        const actualizadas = estaba
          ? imagenesExcluidas.filter((u) => u !== url)
          : [...imagenesExcluidas, url];
        await upsert({ imagenes_excluidas: actualizadas });
        setImagenesExcluidas(actualizadas);
      } catch {
        setError("No se pudo actualizar la imagen.");
      } finally {
        setSaving(false);
      }
    },
    [path, imagenesExcluidas, upsert],
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
        // Quitar también de excluidas si estaba ahí.
        const excluidasLimpias = imagenesExcluidas.filter((u) => u !== url);
        await upsert({
          imagenes: actualizadas,
          imagenes_excluidas: excluidasLimpias,
        });
        setImagenes(actualizadas);
        setImagenesExcluidas(excluidasLimpias);
      } catch {
        setError("No se pudo borrar la imagen.");
      } finally {
        setSaving(false);
      }
    },
    [path, imagenes, imagenesExcluidas, upsert],
  );

  return {
    descripcion,
    imagenes,
    puntosClave,
    imagenesExcluidas,
    loading,
    saving,
    error,
    configured: supabaseConfigured,
    guardarDescripcion,
    agregarPunto,
    borrarPunto,
    subirImagenes,
    borrarImagen,
    toggleExcluirImagen,
  };
}
