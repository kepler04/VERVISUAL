/**
 * Modelo de datos de Anatomía Veterinaria — Unidad III "Estructuras por reconocer".
 *
 * La jerarquía sigue exactamente la indentación del PDF de referencia (hasta
 * 4 niveles de profundidad en algunos sistemas).
 *
 *   Sistema (raíz, con slug y ruta propia)
 *     └─ Estructura / Grupo
 *          └─ Sub-estructura
 *               └─ Detalle
 *
 * Un `AnatomyNode` con `children` es una rama; sin `children`, es una hoja
 * clicable que abre el panel de detalle.
 *
 * Convenciones de transcripción (acordadas con el usuario):
 *  - Erratas evidentes de dictado corregidas (Diastema, Istmo, Saco caudo
 *    ventral, etc.).
 *  - Abreviaturas expandidas: A.→Arteria, V.→Vena, Lig.→Ligamento,
 *    M.→Músculo, Lob.→Lóbulo, R.→Rama. El sufijo "D-I" → "(derecha e
 *    izquierda)".
 */

export type AnatomyNode = {
  name: string;
  children?: AnatomyNode[];
};

export type AnatomySystem = {
  slug: string;
  name: string;
  /** Nombre corto para encabezados / breadcrumbs */
  short: string;
  description: string;
  icon: SystemIconName;
  children: AnatomyNode[];
};

export type SystemIconName =
  | "abdomen"
  | "digestive"
  | "urinary"
  | "male"
  | "female";

/* ── Utilidades ──────────────────────────────────────────────────────── */

/** Cuenta las hojas (estructuras concretas) de un nodo o lista. */
export function countLeaves(nodes: AnatomyNode[]): number {
  return nodes.reduce((total, node) => {
    if (!node.children || node.children.length === 0) return total + 1;
    return total + countLeaves(node.children);
  }, 0);
}

export function getSystem(slug: string): AnatomySystem | undefined {
  return SYSTEMS.find((s) => s.slug === slug);
}

/* ── Datos ───────────────────────────────────────────────────────────── */

export const SYSTEMS: AnatomySystem[] = [
  /* ════════════════════════ 1. CAVIDAD ABDOMINAL Y PÉLVICA ═══════════ */
  {
    slug: "cavidad-abdominal-pelvica",
    name: "Cavidad Abdominal y Pélvica",
    short: "Cavidad Abdominal y Pélvica",
    description: "Peritoneo, mesenterios, omentos y fondos de saco peritoneales.",
    icon: "abdomen",
    children: [
      { name: "Peritoneo parietal" },
      { name: "Peritoneo visceral" },
      { name: "Mesenterio" },
      { name: "Omento mayor" },
      { name: "Omento menor" },
      { name: "Bursa Omento" },
      {
        name: "Fondo de saco o excavación",
        children: [
          { name: "Pararectal" },
          { name: "Rectogenital" },
          { name: "Genitovesical" },
          { name: "Vesicopúbico" },
        ],
      },
    ],
  },

  /* ════════════════════════ 2. DIGESTIVO ═════════════════════════════ */
  {
    slug: "sistema-digestivo",
    name: "Sistema Digestivo",
    short: "Digestivo",
    description: "Desde los labios hasta el páncreas, incluyendo estómagos y colon.",
    icon: "digestive",
    children: [
      {
        name: "Labios",
        children: [
          { name: "Labio superior" },
          { name: "Labio inferior" },
          { name: "Comisura labial" },
          { name: "Frenillo del labio superior" },
          { name: "Frenillo del labio inferior" },
        ],
      },
      {
        name: "Dientes",
        children: [
          {
            name: "Incisivos",
            children: [
              { name: "Pinzas" },
              { name: "Medianos (1ros - 2dos)" },
              { name: "Extremos" },
            ],
          },
          { name: "Caninos" },
          { name: "Premolares" },
          { name: "Molares" },
          { name: "Diastema" },
          { name: "Rodete dentario" },
          { name: "Infundíbulo" },
          { name: "Canal dental o estrella dental" },
          { name: "Cola de golondrina" },
          { name: "Surco de Galvayne" },
          { name: "Muela carnicera" },
        ],
      },
      {
        name: "Lengua",
        children: [
          { name: "Regiones" },
          {
            name: "Papilas",
            children: [
              { name: "Filiformes" },
              { name: "Lenticular" },
              { name: "Cónicas" },
              { name: "Bunoforme" },
              { name: "Fungiforme" },
              { name: "Foliada" },
              { name: "Circunvalada" },
            ],
          },
          { name: "Torus lingual" },
          { name: "Fosa lingual" },
          { name: "Lyssa lingual" },
          { name: "Frenillo lingual" },
        ],
      },
      {
        name: "Paladar",
        children: [
          {
            name: "Paladar duro",
            children: [
              { name: "Papila incisiva" },
              { name: "Crestas palatinas" },
              { name: "Rafe palatino" },
            ],
          },
          {
            name: "Paladar blando",
            children: [
              { name: "Arco palatogloso" },
              { name: "Arco palatofaríngeo" },
            ],
          },
        ],
      },
      { name: "Istmo de las fauces" },
      {
        name: "Glándulas salivales",
        children: [
          { name: "Parótida" },
          { name: "Mandibular" },
          { name: "Sublingual" },
          { name: "Cigomática" },
          { name: "Carúncula sublingual" },
        ],
      },
      { name: "Esófago" },
      {
        name: "Estómago monocavitario",
        children: [
          { name: "Regiones" },
          { name: "Esfínter del cardias" },
          { name: "Esfínter pilórico - torus" },
          { name: "Curvatura" },
          { name: "Divertículo gástrico" },
          { name: "Mucosa glandular - aglandular" },
          { name: "Borde plegado" },
        ],
      },
      {
        name: "Estómago policavitario",
        children: [
          {
            name: "Rumen",
            children: [
              {
                name: "Surcos - pilar",
                children: [
                  { name: "Longitudinal derecho" },
                  { name: "Longitudinal izquierdo" },
                  { name: "Craneal" },
                  { name: "Caudal" },
                  { name: "Coronario dorsal" },
                  { name: "Coronario ventral" },
                  { name: "Accesorio" },
                  { name: "Ruminoreticular" },
                ],
              },
              { name: "Saco dorsal" },
              { name: "Saco ventral" },
              { name: "Saco caudo dorsal" },
              { name: "Saco caudo ventral" },
              { name: "Atrio ruminal" },
              { name: "Insula ruminal" },
              { name: "Mucosa interna" },
            ],
          },
          {
            name: "Retículo",
            children: [{ name: "Surco reticular" }, { name: "Mucosa" }],
          },
          { name: "Omaso" },
          {
            name: "Abomaso",
            children: [
              { name: "Curvatura" },
              { name: "Torus pilórico" },
              { name: "Mucosa" },
            ],
          },
          { name: "Arteria Gástrica (derecha e izquierda)" },
          { name: "Arteria Gastroepiploica (derecha e izquierda)" },
          { name: "Arteria Ruminal (derecha e izquierda)" },
          { name: "Arteria Reticular" },
          { name: "Arteria Omasal" },
          { name: "Ligamento Gastroesplénico" },
        ],
      },
      {
        name: "Duodeno",
        children: [
          { name: "Asa duodenal" },
          { name: "Flexura duodenal craneal" },
          { name: "Flexura duodenal caudal" },
          { name: "Duodeno descendente" },
          { name: "Duodeno ascendente" },
          { name: "Flexura duodeno yeyunal" },
        ],
      },
      {
        name: "Yeyuno",
        children: [{ name: "Asas yeyunales" }],
      },
      {
        name: "Íleon",
        children: [{ name: "Papila ileal" }, { name: "Pliegue ileocecal" }],
      },
      {
        name: "Ciego",
        children: [
          { name: "Orificio ileocecal" },
          { name: "Orificio cecocólico" },
          { name: "Pliegue cecocólico" },
        ],
      },
      {
        name: "Colon",
        children: [
          { name: "Colon ventral derecho" },
          { name: "Colon ventral izquierdo" },
          { name: "Colon dorsal izquierdo" },
          { name: "Colon dorsal derecho" },
          { name: "Flexura esternal o diafragmática ventral" },
          { name: "Flexura pélvica" },
          { name: "Flexura diafragmática o diafragmática dorsal" },
          { name: "Colon ascendente" },
          { name: "Colon transverso" },
          { name: "Colon descendente" },
          { name: "Flexura sigmoidea" },
          {
            name: "Colon espiral",
            children: [
              { name: "Asa proximal" },
              { name: "Giros centrípetos" },
              { name: "Flexura central" },
              { name: "Giros centrífugos" },
              { name: "Asa distal" },
            ],
          },
          {
            name: "Tenias",
            children: [
              { name: "Tenias libres" },
              { name: "Tenias mesocólicas" },
              { name: "Haustras" },
            ],
          },
        ],
      },
      { name: "Arteria Mesentérica craneal" },
      { name: "Arteria yeyunal" },
      { name: "Arteria Ileal" },
      { name: "Arteria cecal" },
      { name: "Arteria Anti Mesentérica" },
      { name: "Arteria Cólica" },
      { name: "Rama Cólica" },
      { name: "Arteria Cólica derecha" },
      { name: "Arteria mesentérica caudal" },
      {
        name: "Hígado",
        children: [
          { name: "Ligamento triangular (derecho e izquierdo)" },
          { name: "Ligamento coronario" },
          { name: "Ligamento Falciforme" },
          {
            name: "Lóbulo Derecho",
            children: [{ name: "Lateral" }, { name: "Medial" }],
          },
          {
            name: "Lóbulo Izquierdo",
            children: [{ name: "Lateral" }, { name: "Medial" }],
          },
          { name: "Lóbulo Cuadrado" },
          {
            name: "Lóbulo Caudado",
            children: [
              { name: "Proceso Caudado" },
              { name: "Proceso Papilar" },
            ],
          },
          { name: "Fosa renal" },
          { name: "Ligamento Hepatogástrico" },
          { name: "Conductos hepáticos" },
          { name: "Conducto Cístico" },
          { name: "Conducto Colédoco" },
          { name: "Arteria Hepática" },
        ],
      },
      {
        name: "Páncreas",
        children: [
          { name: "Lóbulo Derecho - Izquierdo" },
          { name: "Cuerpo" },
          { name: "Papila duodenal mayor" },
        ],
      },
    ],
  },

  /* ════════════════════════ 3. URINARIO ══════════════════════════════ */
  {
    slug: "sistema-urinario",
    name: "Sistema Urinario",
    short: "Urinario",
    description: "Riñón y vías urinarias: uréter, vejiga y uretra.",
    icon: "urinary",
    children: [
      {
        name: "Riñón",
        children: [
          { name: "Cápsula adiposa" },
          { name: "Cápsula fibrosa" },
          { name: "Corteza" },
          { name: "Médula" },
          { name: "Lóbulo renal" },
          { name: "Papila renal" },
          { name: "Cáliz menor" },
          { name: "Cáliz mayor" },
          { name: "Pelvis renal" },
          { name: "Hilio renal" },
          { name: "Arteria y Vena Arcuata" },
        ],
      },
      { name: "Uréter" },
      {
        name: "Vejiga",
        children: [
          { name: "Desembocadura de los uréteres (ostium - orificio)" },
          { name: "Orificio uretral interno" },
          { name: "Trígono vesical" },
          { name: "Ligamento vesical medio" },
          { name: "Ligamento Vesical lateral" },
        ],
      },
      { name: "Uretra" },
    ],
  },

  /* ════════════════════════ 4. REPRODUCTOR MACHO ═════════════════════ */
  {
    slug: "sistema-reproductor-macho",
    name: "Sistema Reproductor Macho",
    short: "Reproductor Macho",
    description: "Escroto, testículo, vías, glándulas accesorias y pene.",
    icon: "male",
    children: [
      {
        name: "Escroto",
        children: [{ name: "Piel" }, { name: "Túnica dartos" }],
      },
      { name: "Túnica vaginal parietal" },
      { name: "Túnica vaginal visceral" },
      { name: "Túnica albugínea" },
      {
        name: "Testículo",
        children: [
          { name: "Parénquima testicular" },
          { name: "Mediastino testicular" },
        ],
      },
      {
        name: "Epidídimo",
        children: [
          { name: "Cabeza" },
          { name: "Cuerpo" },
          { name: "Cola" },
          { name: "Ligamento propio del testículo" },
          { name: "Ligamento de la cola del epidídimo" },
        ],
      },
      { name: "Conducto deferente" },
      { name: "Plexo pampiniforme" },
      { name: "Músculo cremáster" },
      { name: "Cordón espermático" },
      { name: "Anillo inguinal" },
      { name: "Ampolla del deferente" },
      { name: "Próstata" },
      { name: "Glándula vesicular" },
      { name: "Glándula bulbouretral" },
      { name: "Músculo Isquiocavernoso" },
      { name: "Músculo Bulboesponjoso" },
      {
        name: "Cuerpo",
        children: [
          { name: "Cuerpo esponjoso" },
          { name: "Cuerpo cavernoso" },
          { name: "Flexura sigmoidea - S peneana" },
        ],
      },
      {
        name: "Glande",
        children: [
          {
            name: "Corona del glande",
            children: [{ name: "Proceso uretral" }, { name: "Fosa del glande" }],
          },
          { name: "Yelmo del glande" },
          { name: "Glande espiralado" },
          { name: "Proceso uretral" },
          { name: "Os penis" },
          { name: "Bulbo del glande" },
        ],
      },
      {
        name: "Prepucio",
        children: [{ name: "Divertículo prepucial" }],
      },
    ],
  },

  /* ════════════════════════ 5. REPRODUCTOR FEMENINO ══════════════════ */
  {
    slug: "sistema-reproductor-femenino",
    name: "Sistema Reproductor Femenino",
    short: "Reproductor Femenino",
    description: "Ovario, tuba, útero, ligamentos y genitales externos.",
    icon: "female",
    children: [
      {
        name: "Ovario",
        children: [{ name: "Folículo maduro" }, { name: "Cuerpo lúteo" }],
      },
      {
        name: "Tuba uterina",
        children: [
          { name: "Infundíbulo" },
          { name: "Ampolla" },
          { name: "Istmo" },
          { name: "Unión útero tubárica" },
          { name: "Papila tubárica" },
        ],
      },
      {
        name: "Útero",
        children: [
          {
            name: "Cuerno uterino",
            children: [{ name: "Carúncula endometrial" }],
          },
          {
            name: "Cuerpo del útero",
            children: [{ name: "Velo uterino" }],
          },
          {
            name: "Cérvix",
            children: [
              { name: "Anillos cervicales" },
              { name: "Pulvinis cervicales" },
              { name: "Roseta cervical" },
            ],
          },
        ],
      },
      {
        name: "Ligamento Ancho",
        children: [
          { name: "Mesoovario" },
          { name: "Mesometrio" },
          { name: "Mesosalpinx" },
        ],
      },
      { name: "Bolsa ovárica" },
      { name: "Ligamento redondo" },
      { name: "Ligamento Intercornual" },
      { name: "Ligamento Propio del ovario" },
      { name: "Ligamento Suspensor del ovario" },
      {
        name: "Vagina",
        children: [
          {
            name: "Vagina propiamente dicha",
            children: [{ name: "Fórnix" }],
          },
          {
            name: "Vestíbulo vaginal",
            children: [{ name: "Orificio uretral externo" }],
          },
        ],
      },
      {
        name: "Vulva",
        children: [
          { name: "Hendidura vulvar" },
          { name: "Labios vulvares" },
          { name: "Comisura vulvar" },
        ],
      },
      {
        name: "Clítoris",
        children: [
          { name: "Ampolla del clítoris" },
          { name: "Fosa del clítoris" },
        ],
      },
    ],
  },
];
