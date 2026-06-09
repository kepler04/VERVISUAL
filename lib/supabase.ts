import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase compartido (lado del navegador).
 *
 * Usa las variables públicas NEXT_PUBLIC_* — la anon key está pensada para
 * exponerse en el cliente. La protección de la base de datos depende de las
 * políticas RLS configuradas en Supabase, no del secreto de esta clave.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // En build/SSR puede no estar; avisamos en consola sin romper el render.
  // Las acciones de datos fallarán de forma controlada hasta configurarlas.
  console.warn(
    "[supabase] Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Crea .env.local con tus credenciales.",
  );
}

// Si faltan credenciales usamos un placeholder válido para que createClient no
// lance en build/SSR (prerender de páginas SSG). Las acciones reales se
// bloquean vía `supabaseConfigured`, mostrando un aviso en la interfaz.
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key",
);

/** Nombre de la tabla de contenido por estructura. */
export const CONTENIDO_TABLE = "estructura_contenido";

/** Bucket público de Storage para las imágenes. */
export const BUCKET = "anatomia";

/** True si las credenciales están presentes (para deshabilitar UI si no). */
export const supabaseConfigured = Boolean(url && anonKey);
