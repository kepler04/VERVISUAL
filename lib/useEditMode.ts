"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Modo edición desbloqueado por una clave simple.
 *
 * AVISO DE SEGURIDAD: esto SOLO oculta/muestra los controles de edición en la
 * interfaz. No protege la base de datos — cualquiera con conocimientos podría
 * escribir vía la anon key saltando la UI. Es aceptable aquí porque el sistema
 * es de uso privado entre dos personas, no público.
 */

const STORAGE_KEY = "vv-edit-mode";

export function useEditMode() {
  const [editMode, setEditMode] = useState(false);

  // Recupera el estado de la sesión (persiste mientras la pestaña viva).
  useEffect(() => {
    if (typeof window === "undefined") return;
    setEditMode(window.sessionStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  const desbloquear = useCallback((clave: string): boolean => {
    const esperada = process.env.NEXT_PUBLIC_EDIT_KEY;
    if (esperada && clave === esperada) {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
      setEditMode(true);
      return true;
    }
    return false;
  }, []);

  const bloquear = useCallback(() => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setEditMode(false);
  }, []);

  return { editMode, desbloquear, bloquear };
}
