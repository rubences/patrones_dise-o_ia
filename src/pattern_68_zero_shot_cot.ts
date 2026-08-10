/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 68 — ZERO-SHOT COT (RAZONAMIENTO SIN EJEMPLOS)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Zero-shot directo:       Zero-Shot CoT:
 *  ────────────────         ──────────────
 *  Pregunta → Respuesta     Pregunta + "Piensa paso a paso"
 *  (puede errar)            → Razonamiento visible → Respuesta
 *                           (más preciso, sin ejemplos)
 *
 *  Variantes implementadas:
 *  ├─ "Piensa paso a paso"
 *  ├─ "Tomemos un respiro y pensemos"
 *  ├─ "Razona antes de responder"
 *  └─ "Muestra tu trabajo"
 *
 *  Idea: Activar el razonamiento del LLM con un simple sufijo
 *  sin necesidad de proporcionar ejemplos (zero-shot).
 *
 *  Diferencia vs CoT (26): CoT usa múltiples llamadas y pasos
 *  explícitos; Zero-Shot CoT es un único prompt con sufijo mágico.
 *
 *  Ventajas:
 *  - Sin ejemplos necesarios (zero-shot)
 *  - Mejora inmediata con un sufijo
 *  - Bajo costo (1 llamada)
 *  - Universal para cualquier tarea de razonamiento
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export type SufijoCoT =
  | "paso-a-paso"
  | "respira"
  | "razona-primero"
  | "muestra-trabajo"
  | "hipotesis"
  | "pros-contras";

const SUFIJOS: Record<SufijoCoT, string> = {
  "paso-a-paso": "Piensa paso a paso antes de dar la respuesta final.",
  "respira": "Tomemos un momento y pensemos esto detenidamente.",
  "razona-primero": "Primero razona en voz alta, luego da tu respuesta final.",
  "muestra-trabajo": "Muestra todo tu proceso de pensamiento antes de concluir.",
  "hipotesis": "Plantea hipótesis, evalúalas, y llega a una conclusión.",
  "pros-contras": "Considera pros y contras antes de tu recomendación final.",
};

export interface ResultadoZeroShotCoT {
  pregunta: string;
  sufijo: SufijoCoT;
  razonamiento: string;
  respuestaFinal: string;
}

export class ZeroShotCoT {
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
  }

  async razonar(pregunta: string, sufijo: SufijoCoT = "paso-a-paso"): Promise<ResultadoZeroShotCoT> {
    const promptCompleto = `${pregunta}\n\n${SUFIJOS[sufijo]}`;

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions: promptCompleto,
      input: "",
    });

    // Extraer razonamiento y respuesta final
    const lineas = resp.output_text.split("\n").filter((l) => l.trim());
    const ultimaLinea = lineas[lineas.length - 1] ?? resp.output_text;
    const razonamiento = lineas.slice(0, -1).join("\n");

    return {
      pregunta,
      sufijo,
      razonamiento,
      respuestaFinal: ultimaLinea,
    };
  }

  async compararSufijos(pregunta: string, sufijos: SufijoCoT[]): Promise<ResultadoZeroShotCoT[]> {
    console.log(`\n   🔬 Comparando ${sufijos.length} sufijos para: "${pregunta.slice(0, 50)}..."`);
    return Promise.all(sufijos.map((s) => this.razonar(pregunta, s)));
  }

  async sinCoT(pregunta: string): Promise<string> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: pregunta,
      input: "",
    });
    return resp.output_text;
  }
}

export async function demostrarZeroShotCoT(client: OpenAI = makeClient()): Promise<void> {
  paso("🧠", "Demostrando Zero-Shot CoT Pattern");

  const zscot = new ZeroShotCoT(client);

  paso("1️⃣", "Comparar: Sin CoT vs Con CoT (paso-a-paso)");
  const pregunta = "¿Cuántos patrones debería implementar primero para maximizar el ROI en un proyecto de IA?";

  const sinCot = await zscot.sinCoT(pregunta);
  console.log(`\n   Sin CoT: "${sinCot.slice(0, 120)}..."`);

  const conCot = await zscot.razonar(pregunta, "paso-a-paso");
  console.log(`\n   Con CoT (paso-a-paso):`);
  console.log(`   Razonamiento: "${conCot.razonamiento.slice(0, 150)}..."`);
  console.log(`   Conclusión: "${conCot.respuestaFinal.slice(0, 120)}"`);

  paso("2️⃣", "Sufijo 'pros-contras' para decisión técnica");
  const r2 = await zscot.razonar(
    "¿Usar RAG o fine-tuning para un chatbot de soporte técnico?",
    "pros-contras",
  );
  console.log(`\n   Razonamiento: "${r2.razonamiento.slice(0, 200)}..."`);
  console.log(`   Decisión: "${r2.respuestaFinal.slice(0, 120)}"`);

  paso("3️⃣", "Sufijo 'hipótesis' para análisis complejo");
  const r3 = await zscot.razonar(
    "¿Por qué el patrón Flyweight es tan efectivo para reducir costos en sistemas LLM?",
    "hipotesis",
  );
  console.log(`\n   Hipótesis y conclusión: "${r3.respuestaFinal.slice(0, 150)}"`);

  paso("✅", "Zero-Shot CoT activando razonamiento profundo con un simple sufijo");
}

async function main(): Promise<void> { await demostrarZeroShotCoT(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
