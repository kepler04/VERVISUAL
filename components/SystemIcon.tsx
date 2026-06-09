import type { ReactElement } from "react";
import type { SystemIconName } from "@/lib/anatomy-data";

/* Íconos de trazo fino, estilo lámina técnica anatómica. */

function Abdomen() {
  return (
    <svg viewBox="0 0 32 32" fill="none" strokeWidth="1.6" aria-hidden="true">
      <path
        d="M16 4c6 0 10 3 10 9 0 7-4 11-10 15C10 24 6 20 6 13c0-6 4-9 10-9Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
      <path d="M16 4v24M9 11h14M8 17h16" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

function Digestive() {
  return (
    <svg viewBox="0 0 32 32" fill="none" strokeWidth="1.6" aria-hidden="true">
      <path
        d="M14 4v6c0 2-3 2-3 5s4 3 4 6-3 2-3 4 2 2 4 2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 6c3 0 5 2 5 5s-3 3-3 6 4 4 1 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Urinary() {
  return (
    <svg viewBox="0 0 32 32" fill="none" strokeWidth="1.6" aria-hidden="true">
      <path
        d="M10 7c2.5 0 4 1.5 4 4s-1 4-1 7 2 4 2 6M22 7c-2.5 0-4 1.5-4 4s1 4 1 7-2 4-2 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 11h4" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

function Male() {
  return (
    <svg viewBox="0 0 32 32" fill="none" strokeWidth="1.6" aria-hidden="true">
      <circle cx="13" cy="19" r="7" stroke="currentColor" />
      <path d="M18 14l8-8m0 0h-6m6 0v6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Female() {
  return (
    <svg viewBox="0 0 32 32" fill="none" strokeWidth="1.6" aria-hidden="true">
      <circle cx="16" cy="12" r="7" stroke="currentColor" />
      <path d="M16 19v9M12 24h8" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

const ICONS: Record<SystemIconName, () => ReactElement> = {
  abdomen: Abdomen,
  digestive: Digestive,
  urinary: Urinary,
  male: Male,
  female: Female,
};

export function SystemIcon({ name }: { name: SystemIconName }) {
  const Glyph = ICONS[name];
  return <Glyph />;
}
