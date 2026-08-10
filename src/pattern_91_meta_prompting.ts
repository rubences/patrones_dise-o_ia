/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 91 — META-PROMPTING (OPTIMIZACIÓN AUTOMÁTICA DE PROMPTS)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Prompt v0] ──evaluar──▶ score v0
 *       │
 *       ▼
 *  [LLM optimizador] "reescribe este prompt para mejorar X"
 *       │
 *       ▼
 *  [Prompt v1] ──evaluar──▶ score v1
 *       │
 *  ¿score v1 > mejor score visto? ──SÍ──▶ mejor = v1
 *       │
 *       ▼ (repetir N generaciones)
 *  [Mejor prompt encontrado]
 *
 *  Idea: en vez de que una persona itere manualmente un prompt a
 *  prueba y error, un LLM (o proceso de búsqueda) genera variantes
 *  del prompt mismo, cada una evaluada contra un set de casos, y solo
 *  se conserva la que supera al mejor resultado anterior. El prompt
 *  ES el objeto que se optimiza — no la respuesta a una pregunta
 *  concreta.
 *
 *  Diferencia vs Patrón 4 (Evaluator-Optimizer): ese patrón itera
 *  sobre la RESPUESTA a una pregunta específica usando una rúbrica de
 *  crítica. Meta-Prompting itera sobre el PROMPT/TEMPLATE en sí,
 *  buscando una versión que funcione mejor en PROMEDIO sobre muchos
 *  casos — el resultado es un prompt reutilizable, no una respuesta.
 *
 *  Diferencia vs Patrón 75 (A/B Testing): A/B Testing compara
 *  variantes que un humano ya escribió. Meta-Prompting GENERA esas
 *  variantes automáticamente a partir del prompt actual y el
 *  feedback de evaluación — no requiere que existan de antemano.
 *
 *  Ventajas:
 *  - Descubre formulaciones no obvias para un humano
 *  - Escala: se puede evaluar contra decenas de casos por generación
 *  - El criterio de "mejor" es explícito y medible, no intuición
 *  - Cada generación parte del mejor prompt conocido, no de cero
 */

import { isDirectRun, paso } from "./common.js";

export interface CandidatoPrompt {
  texto: string;
  score: number;
  generacion: number;
}

export type FuncionReescritura = (promptActual: string, feedback: string) => Promise<string>;
export type FuncionEvaluacion = (prompt: string) => Promise<number>; // 0-1

export class OptimizadorPrompts {
  constructor(
    private reescribir: FuncionReescritura,
    private evaluar: FuncionEvaluacion,
  ) {}

  async optimizar(promptInicial: string, generaciones: number): Promise<{ mejor: CandidatoPrompt; historial: CandidatoPrompt[] }> {
    const scoreInicial = await this.evaluar(promptInicial);
    let mejor: CandidatoPrompt = { texto: promptInicial, score: scoreInicial, generacion: 0 };
    const historial: CandidatoPrompt[] = [mejor];
    console.log(`   Gen 0 (base): score ${mejor.score.toFixed(2)}`);

    for (let gen = 1; gen <= generaciones; gen++) {
      const feedback = `Score actual: ${mejor.score.toFixed(2)}/1.0. Mejora precisión y concisión.`;
      const variante = await this.reescribir(mejor.texto, feedback);
      const score = await this.evaluar(variante);
      const candidato: CandidatoPrompt = { texto: variante, score, generacion: gen };
      historial.push(candidato);

      if (score > mejor.score) {
        console.log(`   Gen ${gen}: score ${score.toFixed(2)} ↑ (mejora, se conserva)`);
        mejor = candidato;
      } else {
        console.log(`   Gen ${gen}: score ${score.toFixed(2)} ↓ (no mejora, se descarta)`);
      }
    }

    return { mejor, historial };
  }
}

// ── Reescritor y evaluador simulados: en producción serían llamadas
// reales a openai.responses.create() (reescritura) y a un LLM-as-Judge
// (Patrón 73) o a métricas deterministas sobre un set de casos. ──
function reescritorSimulado(): FuncionReescritura {
  const mejoras = [
    " Responde en máximo 3 frases.",
    " Cita la fuente de cada afirmación.",
    " Si no sabes la respuesta, dilo explícitamente en vez de inventar.",
  ];
  let indice = 0;
  return async (promptActual: string) => {
    const mejora = mejoras[indice % mejoras.length];
    indice++;
    return promptActual + mejora;
  };
}

function evaluadorSimulado(): FuncionEvaluacion {
  // Simula que cada mejora específica (frases cortas, citar fuente) sube el
  // score, pero con rendimientos decrecientes — para que el bucle converja.
  return async (prompt: string) => {
    let score = 0.5;
    if (prompt.includes("máximo 3 frases")) score += 0.2;
    if (prompt.includes("Cita la fuente")) score += 0.15;
    if (prompt.includes("dilo explícitamente")) score += 0.05;
    return Math.min(1, score);
  };
}

export async function demostrarMetaPrompting(): Promise<void> {
  paso("🧬", "Demostrando Meta-Prompting Pattern");
  console.log(
    "   Nota: reescritor y evaluador son simulados en esta demo. En producción\n" +
      "   el reescritor llamaría al LLM y el evaluador usaría LLM-as-Judge (Patrón 73)\n" +
      "   o métricas deterministas sobre un set de casos golden.",
  );

  const optimizador = new OptimizadorPrompts(reescritorSimulado(), evaluadorSimulado());

  paso("1️⃣", "Optimizar un prompt base durante 3 generaciones");
  const promptBase = "Responde la pregunta del usuario.";
  const { mejor, historial } = await optimizador.optimizar(promptBase, 3);

  paso("2️⃣", "Resultado: el mejor prompt encontrado, no la última generación");
  console.log(`   Mejor prompt (gen ${mejor.generacion}, score ${mejor.score.toFixed(2)}):`);
  console.log(`   "${mejor.texto}"`);
  console.log(`\n   Progresión de scores: ${historial.map((h) => h.score.toFixed(2)).join(" → ")}`);

  paso("✅", "Meta-Prompting descubriendo automáticamente mejores formulaciones de prompt");
}

async function main(): Promise<void> {
  await demostrarMetaPrompting();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
