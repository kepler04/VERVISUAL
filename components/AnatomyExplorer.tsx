"use client";

import { useState } from "react";
import type { AnatomyNode, AnatomySystem } from "@/lib/anatomy-data";
import { useEditMode } from "@/lib/useEditMode";
import { EstructuraDetalle } from "@/components/EstructuraDetalle";

/* ── Chevron para ramas expandibles ──────────────────────────────────── */

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      className={`h-4 w-4 shrink-0 text-surgical-600 transition-transform duration-300 ${
        open ? "rotate-90" : ""
      }`}
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Nodo recursivo del árbol ────────────────────────────────────────── */

function TreeNode({
  node,
  depth,
  path,
  selected,
  onSelect,
}: {
  node: AnatomyNode;
  depth: number;
  path: string;
  selected: string | null;
  onSelect: (path: string, name: string) => void;
}) {
  const isBranch = !!node.children && node.children.length > 0;
  const [open, setOpen] = useState(depth === 0);
  const isSelected = selected === path;

  if (isBranch) {
    return (
      <li>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-ink transition-colors hover:bg-surgical-900/[0.04]"
        >
          <Chevron open={open} />
          <span>{node.name}</span>
          <span className="tabular ml-auto rounded-full bg-surgical-900/5 px-2 py-0.5 text-[11px] font-medium text-surgical-700">
            {node.children!.length}
          </span>
        </button>
        {open && (
          <ul className="ml-[11px] border-l border-surgical-900/10 pl-3">
            {node.children!.map((child) => (
              <TreeNode
                key={`${path}/${child.name}`}
                node={child}
                depth={depth + 1}
                path={`${path}/${child.name}`}
                selected={selected}
                onSelect={onSelect}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  // Hoja: estructura concreta y clicable
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(path, node.name)}
        aria-current={isSelected}
        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
          isSelected
            ? "bg-surgical-700 font-medium text-paper"
            : "text-ink/75 hover:bg-surgical-900/[0.04] hover:text-ink"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
            isSelected ? "bg-amber-light" : "bg-surgical-300"
          }`}
        />
        {node.name}
      </button>
    </li>
  );
}

/* ── Panel vacío (nada seleccionado) ─────────────────────────────────── */

function PanelVacio() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-surgical-900/15 bg-paper-dark/30 p-10 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-surgical-900/5 text-surgical-600">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="h-7 w-7">
          <path
            d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5c-.7.6-1 1-1 2v.5H9v-.5c0-1-.3-1.4-1-2A6 6 0 0 1 12 3Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/55">
        Selecciona una estructura del índice para ver su detalle.
      </p>
    </div>
  );
}

/* ── Barra de modo edición ───────────────────────────────────────────── */

function BarraEdicion({
  editMode,
  desbloquear,
  bloquear,
}: {
  editMode: boolean;
  desbloquear: (clave: string) => boolean;
  bloquear: () => void;
}) {
  const [pidiendo, setPidiendo] = useState(false);
  const [clave, setClave] = useState("");
  const [errado, setErrado] = useState(false);

  if (editMode) {
    return (
      <div className="flex items-center gap-3 rounded-full border border-surgical-700/30 bg-surgical-50 px-4 py-1.5 text-sm">
        <span className="flex items-center gap-1.5 font-medium text-surgical-700">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className="h-4 w-4">
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Modo edición
        </span>
        <button
          type="button"
          onClick={bloquear}
          className="text-ink/50 transition-colors hover:text-ink"
        >
          Salir
        </button>
      </div>
    );
  }

  if (pidiendo) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (desbloquear(clave)) {
            setPidiendo(false);
            setClave("");
            setErrado(false);
          } else {
            setErrado(true);
          }
        }}
        className="flex items-center gap-2"
      >
        <input
          autoFocus
          type="password"
          value={clave}
          onChange={(e) => {
            setClave(e.target.value);
            setErrado(false);
          }}
          placeholder="Clave de edición"
          className={`rounded-full border bg-paper px-4 py-1.5 text-sm outline-none transition-colors focus:border-surgical-500 ${
            errado ? "border-red-400" : "border-surgical-900/20"
          }`}
        />
        <button
          type="submit"
          className="rounded-full bg-surgical-700 px-4 py-1.5 text-sm font-semibold text-paper hover:bg-surgical-800"
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => {
            setPidiendo(false);
            setClave("");
            setErrado(false);
          }}
          className="text-sm text-ink/50 hover:text-ink"
        >
          Cancelar
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPidiendo(true)}
      className="flex items-center gap-1.5 rounded-full border border-surgical-900/15 px-4 py-1.5 text-sm font-medium text-ink/60 transition-colors hover:border-surgical-700/30 hover:text-surgical-700"
    >
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className="h-4 w-4">
        <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" />
        <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeLinecap="round" />
      </svg>
      Editar
    </button>
  );
}

/* ── Explorador ──────────────────────────────────────────────────────── */

export function AnatomyExplorer({ system }: { system: AnatomySystem }) {
  const [selected, setSelected] = useState<{ path: string; name: string } | null>(
    null,
  );
  const { editMode, desbloquear, bloquear } = useEditMode();

  // Migas: el path empieza con el slug del sistema (para unicidad global);
  // lo recortamos al mostrar y dejamos solo los grupos intermedios.
  const crumbs = selected
    ? selected.path.split("/").slice(1, -1)
    : [];

  return (
    <div>
      {/* Barra superior con el control de edición */}
      <div className="mb-5 flex justify-end">
        <BarraEdicion
          editMode={editMode}
          desbloquear={desbloquear}
          bloquear={bloquear}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_1.1fr]">
        {/* Índice / árbol */}
        <nav
          aria-label="Índice de estructuras"
          className="rounded-2xl border border-surgical-900/10 bg-paper p-4 shadow-plate"
        >
          <ul>
            {system.children.map((node) => (
              <TreeNode
                key={node.name}
                node={node}
                depth={0}
                path={`${system.slug}/${node.name}`}
                selected={selected?.path ?? null}
                onSelect={(path, name) => setSelected({ path, name })}
              />
            ))}
          </ul>
        </nav>

        {/* Panel de detalle */}
        <div className="lg:sticky lg:top-6 lg:h-fit lg:min-h-[26rem]">
          {selected ? (
            <EstructuraDetalle
              key={selected.path}
              path={selected.path}
              name={selected.name}
              crumbs={crumbs}
              systemName={system.short}
              editMode={editMode}
            />
          ) : (
            <PanelVacio />
          )}
        </div>
      </div>
    </div>
  );
}
