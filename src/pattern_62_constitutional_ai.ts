/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 62 — CONSTITUTIONAL AI (IA CONSTITUCIONAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Respuesta inicial del LLM]
 *       │
 *       ▼
 *  [Auto-crítica contra Principios]
 *  ├─ Principio 1: ¿Es segura?
 *  ├─ Principio 2: ¿Es veraz?
 *  ├─ Principio 3: ¿Es útil?
 *  └─ Principio 4: ¿Respeta privacidad?
 *
 *       │
 *       ▼
 *  [Revisión y Corrección]
 *  └─ LLM se auto-corrige basándose en críticas
 *
 *       │
 *       ▼
 *  [Respuesta mejorada y alineada]
 *
 *  Idea: Usar un conjunto de principios (constitución) para
 *  que el LLM critique y mejore sus propias respuestas.
 *
 *  Origen: Anthropic (Claude) — Alinear LLMs sin supervisión humana
 *
 *  Ventajas:
 *  - Alineación automática con valores
 *  - Reduce respuestas dañinas sin RLHF
 *  - Auditable (principios explícitos)
 *  - Adaptable a diferentes dominios
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface Principio {
  id: string;
  enunciado: string;
  pregunta: string; // Pregunta de auto-evaluación
}

export const CONSTITUCION_ESTANDAR: Principio[] = [
  { id: "P1", enunciado: "Ser veraz y no fabricar información", pregunta: "¿Contiene afirmaciones que podrían ser incorrectas o inventadas?" },
  { id: "P2", enunciado: "No causar daño ni facilitar actividades ilegales", pregunta: "¿Podría esta respuesta causar daño o ser usada de forma dañina?" },
  { id: "P3", enunciado: "Respetar la privacidad de las personas", pregunta: "¿Expone o solicita información privada inapropiadamente?" },
  { id: "P4", enunciado: "Ser útil y constructivo", pregunta: "¿Es genuinamente útil para el usuario?" },
];

export interface ResultadoConstitucional {
  respuestaOriginal: string;
  criticas: { principio: string; critica: string; necesitaRevision: boolean }[];
  respuestaFinal: string;
  revisionesRealizadas: number;
}

export class AgenteConstitucional {
  private client: OpenAI;
  private constitucion: Principio[];

  constructor(client: OpenAI = makeClient(), constitucion = CONSTITUCION_ESTANDAR) {
    this.client = client;
    this.constitucion = constitucion;
  }

  async responder(consulta: string): Promise<ResultadoConstitucional> {
    console.log(`\n   ⚖️  Constitutional AI: "${consulta.slice(0, 50)}..."`);

    // Generar respuesta inicial
    const resp0 = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: consulta,
      input: "",
    });
    const respuestaOriginal = resp0.output_text;
    console.log(`   ✓ Respuesta inicial generada`);

    // Auto-crítica contra cada principio
    const criticas: ResultadoConstitucional["criticas"] = [];
    let necesitaRevision = false;

    for (const principio of this.constitucion.slice(0, 3)) { // Limitamos a 3 para demo
      const respCritica = await this.client.responses.create({
        model: DEFAULT_MODEL,
        reasoning: { effort: "low" },
        store: false,
        instructions: `Principio: "${principio.enunciado}"
Pregunta de evaluación: ${principio.pregunta}

Respuesta a evaluar:
"${respuestaOriginal.slice(0, 200)}"

¿Viola esta respuesta el principio? Responde: 
VIOLA: [SÍ/NO]
CRÍTICA: [explicación breve si viola]`,
        input: "",
      });

      const viola = respCritica.output_text.toUpperCase().includes("VIOLA: SÍ");
      const criticaMatch = respCritica.output_text.match(/CRÍTICA:\s*(.+)/s);
      criticas.push({
        principio: principio.id,
        critica: criticaMatch?.[1]?.trim() ?? "Sin críticas",
        necesitaRevision: viola,
      });

      if (viola) necesitaRevision = true;
      console.log(`   ${viola ? "⚠️ " : "✅"} Principio ${principio.id}: ${viola ? "VIOLA" : "OK"}`);
    }

    let respuestaFinal = respuestaOriginal;
    let revisionesRealizadas = 0;

    // Revisar si hay violaciones
    if (necesitaRevision) {
      const problemas = criticas
        .filter((c) => c.necesitaRevision)
        .map((c) => `- Principio ${c.principio}: ${c.critica}`)
        .join("\n");

      console.log(`   🔧 Corrigiendo ${criticas.filter((c) => c.necesitaRevision).length} violaciones...`);
      const respRevision = await this.client.responses.create({
        model: DEFAULT_MODEL,
        reasoning: { effort: "medium" },
        store: false,
        instructions: `Reescribe esta respuesta corrigiendo los siguientes problemas:

RESPUESTA ORIGINAL: "${respuestaOriginal.slice(0, 300)}"

PROBLEMAS A CORREGIR:
${problemas}

Proporciona una versión mejorada que cumpla todos los principios.`,
        input: "",
      });

      respuestaFinal = respRevision.output_text;
      revisionesRealizadas = 1;
    }

    return { respuestaOriginal, criticas, respuestaFinal, revisionesRealizadas };
  }
}

export async function demostrarConstitutionalAI(client: OpenAI = makeClient()): Promise<void> {
  paso("⚖️", "Demostrando Constitutional AI Pattern");

  const agente = new AgenteConstitucional(client);

  paso("1️⃣", "Respuesta inofensiva (sin revisiones)");
  const r1 = await agente.responder("¿Cuáles son los principales patrones de diseño en IA?");
  console.log(`\n   Revisiones realizadas: ${r1.revisionesRealizadas}`);
  console.log(`   Respuesta: "${r1.respuestaFinal.slice(0, 150)}..."\n`);

  paso("2️⃣", "Respuesta potencialmente problemática (con revisión)");
  const r2 = await agente.responder("Dame información detallada sobre vulnerabilidades de seguridad en APIs");
  console.log(`\n   Revisiones realizadas: ${r2.revisionesRealizadas}`);
  console.log(`   Críticas: ${r2.criticas.filter((c) => c.necesitaRevision).length} principios violados`);
  console.log(`   Respuesta final: "${r2.respuestaFinal.slice(0, 150)}..."\n`);

  paso("✅", "Constitutional AI alineando respuestas con principios éticos automáticamente");
}

async function main(): Promise<void> { await demostrarConstitutionalAI(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
