/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 73 — LLM-AS-JUDGE (LLM COMO JUEZ DE CALIDAD)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Respuesta del Agente]
 *       │
 *       ▼
 *  [Juez LLM]
 *  ├─ ¿Es correcta? (factual accuracy)
 *  ├─ ¿Es relevante? (relevance to question)
 *  ├─ ¿Es segura? (safety)
 *  ├─ ¿Es completa? (completeness)
 *  └─ ¿Es concisa? (conciseness)
 *
 *       │
 *       ▼
 *  [Score por dimensión + Feedback]
 *  {
 *    factual: 8/10,
 *    relevance: 9/10,
 *    safety: 10/10,
 *    overall: 8.5/10,
 *    feedback: "Mejorar X..."
 *  }
 *
 *  Ventajas:
 *  - Evaluación automática sin humanos
 *  - Scoring multi-dimensional
 *  - Feedback accionable
 *  - Escala a millones de respuestas
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface RubricaEvaluacion {
  nombre: string;
  descripcion: string;
  peso: number; // Peso en la puntuación final (0-1)
}

export const RUBRICA_ESTANDAR: RubricaEvaluacion[] = [
  { nombre: "precision_factual", descripcion: "¿La información es correcta y verificable?", peso: 0.3 },
  { nombre: "relevancia", descripcion: "¿Responde directamente a la pregunta?", peso: 0.25 },
  { nombre: "completitud", descripcion: "¿Cubre todos los aspectos importantes?", peso: 0.2 },
  { nombre: "claridad", descripcion: "¿Es fácil de entender?", peso: 0.15 },
  { nombre: "seguridad", descripcion: "¿Evita contenido dañino o inapropiado?", peso: 0.1 },
];

export interface ScoreEvaluacion {
  dimension: string;
  score: number; // 0-10
  feedback: string;
}

export interface ResultadoJuicio {
  pregunta: string;
  respuesta: string;
  scores: ScoreEvaluacion[];
  scorePonderado: number;
  veredicto: "excelente" | "bueno" | "aceptable" | "mejorable" | "deficiente";
  recomendaciones: string[];
}

export class JuezLLM {
  private client: OpenAI;
  private rubrica: RubricaEvaluacion[];

  constructor(client: OpenAI = makeClient(), rubrica = RUBRICA_ESTANDAR) {
    this.client = client;
    this.rubrica = rubrica;
  }

  async juzgar(pregunta: string, respuesta: string): Promise<ResultadoJuicio> {
    console.log(`\n   ⚖️  Evaluando respuesta...`);

    const dimensionesStr = this.rubrica
      .map((r) => `${r.nombre} (peso: ${r.peso}): ${r.descripcion}`)
      .join("\n");

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions: `Eres un evaluador experto de calidad de respuestas de IA.

PREGUNTA: "${pregunta}"
RESPUESTA A EVALUAR: "${respuesta.slice(0, 500)}"

Evalúa en estas dimensiones (puntúa de 0-10):
${dimensionesStr}

Formato de respuesta (una línea por dimensión):
DIMENSION: [nombre] | SCORE: [0-10] | FEEDBACK: [comentario breve]
...
RECOMENDACIONES: [mejoras concretas separadas por ;]`,
      input: "",
    });

    // Parsear scores
    const scores: ScoreEvaluacion[] = [];
    const lineas = resp.output_text.split("\n");

    for (const dimension of this.rubrica) {
      const linea = lineas.find((l) => l.includes(`DIMENSION: ${dimension.nombre}`));
      if (linea) {
        const scoreMatch = linea.match(/SCORE:\s*(\d+)/);
        const feedbackMatch = linea.match(/FEEDBACK:\s*(.+)/);
        scores.push({
          dimension: dimension.nombre,
          score: scoreMatch ? parseInt(scoreMatch[1]) : 5,
          feedback: feedbackMatch?.[1]?.trim() ?? "Sin feedback",
        });
      } else {
        scores.push({ dimension: dimension.nombre, score: 7, feedback: "No evaluado explícitamente" });
      }
    }

    // Calcular score ponderado
    const scorePonderado = scores.reduce((total, s) => {
      const rubrica = this.rubrica.find((r) => r.nombre === s.dimension);
      return total + s.score * (rubrica?.peso ?? 0.2);
    }, 0);

    const veredicto: ResultadoJuicio["veredicto"] =
      scorePonderado >= 9 ? "excelente"
      : scorePonderado >= 7 ? "bueno"
      : scorePonderado >= 5 ? "aceptable"
      : scorePonderado >= 3 ? "mejorable"
      : "deficiente";

    // Extraer recomendaciones
    const recsMatch = resp.output_text.match(/RECOMENDACIONES:\s*(.+)/);
    const recomendaciones = recsMatch?.[1]?.split(";").map((r) => r.trim()) ?? [];

    return { pregunta, respuesta, scores, scorePonderado, veredicto, recomendaciones };
  }

  async compararRespuestas(pregunta: string, respuestas: string[]): Promise<{ ranking: number[]; mejorIndice: number }> {
    console.log(`\n   ⚖️  Comparando ${respuestas.length} respuestas...`);
    const juicios = await Promise.all(respuestas.map((r) => this.juzgar(pregunta, r)));
    const scores = juicios.map((j) => j.scorePonderado);
    const ranking = scores.map((_, i) => i).sort((a, b) => scores[b] - scores[a]);
    const mejorIndice = ranking[0];
    return { ranking, mejorIndice };
  }
}

export async function demostrarLLMAsJudge(client: OpenAI = makeClient()): Promise<void> {
  paso("⚖️", "Demostrando LLM-as-Judge Pattern");

  const juez = new JuezLLM(client);

  paso("1️⃣", "Evaluar una respuesta con rúbrica multi-dimensional");

  const pregunta = "¿Qué es el patrón RAG y cuándo usarlo?";
  const respuestaEjemplo = `RAG (Retrieval-Augmented Generation) es una arquitectura que combina 
  la recuperación de documentos relevantes con la generación de respuestas por LLMs. 
  Se usa cuando necesitas respuestas basadas en conocimiento específico del dominio 
  que el modelo no tiene en sus parámetros, o cuando los datos cambian frecuentemente.`;

  const juicio = await juez.juzgar(pregunta, respuestaEjemplo);

  console.log(`\n   📊 Resultado del juicio:`);
  juicio.scores.forEach((s) => {
    const bar = "█".repeat(Math.floor(s.score)) + "░".repeat(10 - Math.floor(s.score));
    console.log(`   ${s.dimension.padEnd(20)} [${bar}] ${s.score}/10`);
  });
  console.log(`\n   Score ponderado: ${juicio.scorePonderado.toFixed(1)}/10 → ${juicio.veredicto.toUpperCase()}`);
  if (juicio.recomendaciones.length > 0) {
    console.log(`   Recomendaciones: ${juicio.recomendaciones[0]}`);
  }

  paso("2️⃣", "Comparar respuestas alternativas");

  const respuestasAlternativas = [
    "RAG es una técnica de IA que busca documentos.",
    respuestaEjemplo,
    "RAG combina búsqueda vectorial con LLMs para respuestas fundamentadas en datos. Ideal para bases de conocimiento propias, documentación actualizada o cuando se necesita citar fuentes. Reduce alucinaciones y permite actualizar el conocimiento sin re-entrenar.",
  ];

  const { ranking, mejorIndice } = await juez.compararRespuestas(pregunta, respuestasAlternativas);
  console.log(`\n   Ranking: ${ranking.map((i) => `R${i + 1}`).join(" > ")}`);
  console.log(`   Mejor respuesta: R${mejorIndice + 1} (índice ${mejorIndice})`);

  paso("✅", "LLM-as-Judge evaluando calidad automáticamente con rúbricas multi-dimensionales");
}

async function main(): Promise<void> { await demostrarLLMAsJudge(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
