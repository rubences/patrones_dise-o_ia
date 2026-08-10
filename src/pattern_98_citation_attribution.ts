/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 98 — CITATION / SOURCE ATTRIBUTION (ATRIBUCIÓN DE FUENTES)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Afirmaciones generadas + fuente de cada una]
 *  "Las ventas subieron 12%" ← doc-ventas-q3.pdf
 *  "El equipo creció a 40 personas" ← doc-rrhh-2026.pdf
 *       │
 *       ▼
 *  [Gestor de Citas]
 *  ├─ Asigna [1], [2]... a cada fuente única
 *  ├─ Inserta marcadores inline en el texto
 *  └─ Genera la lista de referencias al final
 *       │
 *       ▼
 *  "Las ventas subieron 12% [1] y el equipo creció a 40 personas [2].
 *
 *  [1] doc-ventas-q3.pdf
 *  [2] doc-rrhh-2026.pdf"
 *       │
 *       ▼
 *  [Cobertura de citas] = % de afirmaciones con fuente asignada
 *
 *  Idea: cada afirmación de una respuesta debe poder rastrearse hasta
 *  el documento concreto del que salió — formato de cita inline,
 *  lista de referencias, y una métrica de cobertura para detectar
 *  afirmaciones sin fuente antes de mostrarlas al usuario.
 *
 *  Diferencia vs Patrón 52 (Grounding): Grounding VERIFICA si una
 *  afirmación es fiel a las fuentes o es una alucinación (sí/no,
 *  binario). Citation / Source Attribution da FORMATO trazable a
 *  afirmaciones que ya se asume que vienen de una fuente — asigna
 *  [1][2], arma la lista de referencias, y mide qué porcentaje de la
 *  respuesta quedó sin citar. Son complementarios: Grounding decide
 *  si confiar en la afirmación; Citation decide cómo mostrarla y
 *  hacerla verificable por el usuario.
 *
 *  Ventajas:
 *  - El usuario puede verificar cualquier afirmación yendo a la fuente
 *  - La cobertura de citas es una métrica de calidad objetiva
 *  - Detecta afirmaciones "huérfanas" (sin fuente) antes de publicarlas
 *  - Mismo formato de cita reutilizable en cualquier tipo de respuesta
 */

import { isDirectRun, paso } from "./common.js";

export interface Fuente {
  id: string;
  descripcion: string;
}

export interface AfirmacionConFuente {
  texto: string;
  fuenteId: string | null; // null = sin fuente asignada
}

export interface Afirmacion {
  texto: string;
  numeroCita: number | null;
}

export interface RespuestaConCitas {
  textoConCitas: string;
  referencias: { numero: number; fuente: Fuente }[];
  cobertura: number; // 0-1
  afirmacionesSinCitar: string[];
}

export class GestorCitas {
  construirRespuestaConCitas(afirmaciones: AfirmacionConFuente[], fuentesDisponibles: Fuente[]): RespuestaConCitas {
    const numeroPorFuenteId = new Map<string, number>();
    const referencias: { numero: number; fuente: Fuente }[] = [];
    const afirmacionesSinCitar: string[] = [];

    const partes: string[] = [];
    let citadas = 0;

    for (const af of afirmaciones) {
      if (!af.fuenteId) {
        partes.push(af.texto);
        afirmacionesSinCitar.push(af.texto);
        continue;
      }

      let numero = numeroPorFuenteId.get(af.fuenteId);
      if (numero === undefined) {
        const fuente = fuentesDisponibles.find((f) => f.id === af.fuenteId);
        if (!fuente) {
          partes.push(af.texto);
          afirmacionesSinCitar.push(af.texto);
          continue;
        }
        numero = referencias.length + 1;
        numeroPorFuenteId.set(af.fuenteId, numero);
        referencias.push({ numero, fuente });
      }

      partes.push(`${af.texto} [${numero}]`);
      citadas++;
    }

    const textoConCitas = partes.join(" ") + (referencias.length > 0
      ? "\n\n" + referencias.map((r) => `[${r.numero}] ${r.fuente.descripcion}`).join("\n")
      : "");

    return {
      textoConCitas,
      referencias,
      cobertura: afirmaciones.length > 0 ? citadas / afirmaciones.length : 1,
      afirmacionesSinCitar,
    };
  }
}

export async function demostrarCitationAttribution(): Promise<void> {
  paso("📎", "Demostrando Citation / Source Attribution Pattern");

  const gestor = new GestorCitas();
  const fuentes: Fuente[] = [
    { id: "ventas-q3", descripcion: "Informe de Ventas Q3 2026, sección 'Resumen ejecutivo'" },
    { id: "rrhh-2026", descripcion: "Reporte de RRHH 2026, tabla 'Crecimiento de plantilla'" },
  ];

  paso("1️⃣", "Respuesta con todas las afirmaciones citadas");
  const r1 = gestor.construirRespuestaConCitas(
    [
      { texto: "Las ventas subieron un 12% respecto al trimestre anterior", fuenteId: "ventas-q3" },
      { texto: "El equipo creció a 40 personas", fuenteId: "rrhh-2026" },
      { texto: "El margen operativo también mejoró este trimestre", fuenteId: "ventas-q3" }, // misma fuente → mismo [1]
    ],
    fuentes,
  );
  console.log(`   ${r1.textoConCitas}`);
  console.log(`\n   Cobertura de citas: ${(r1.cobertura * 100).toFixed(0)}%`);

  paso("2️⃣", "Respuesta con una afirmación sin fuente — se detecta antes de publicarla");
  const r2 = gestor.construirRespuestaConCitas(
    [
      { texto: "Las ventas subieron un 12%", fuenteId: "ventas-q3" },
      { texto: "Se espera que sigan creciendo el próximo año", fuenteId: null }, // inferencia, no viene de un doc
    ],
    fuentes,
  );
  console.log(`   ${r2.textoConCitas}`);
  console.log(`\n   Cobertura de citas: ${(r2.cobertura * 100).toFixed(0)}%`);
  console.log(`   ⚠️  Afirmaciones sin citar: ${r2.afirmacionesSinCitar.join("; ")}`);

  paso("✅", "Citation / Source Attribution haciendo cada afirmación verificable por el usuario");
}

async function main(): Promise<void> {
  await demostrarCitationAttribution();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
