/**
 * PATRÓN 73 — LLM-AS-JUDGE
 *
 * Un juez LLM es una señal de evaluación, no ground truth. Esta versión
 * falla de forma explícita cuando la salida no cumple la rúbrica: nunca
 * imputa una puntuación favorable para una dimensión ausente o inválida.
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface RubricaEvaluacion {
  nombre: string;
  descripcion: string;
  peso: number;
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
  score: number | null;
  feedback: string | null;
  valido: boolean;
  error?: string;
}

export type EstadoJuicio = "valido" | "invalido";
export type VeredictoJuicio = "excelente" | "bueno" | "aceptable" | "mejorable" | "deficiente" | "invalido";

export interface ResultadoParseoJuez {
  estado: EstadoJuicio;
  scores: ScoreEvaluacion[];
  scorePonderado: number | null;
  veredicto: VeredictoJuicio;
  recomendaciones: string[];
  errores: string[];
}

export interface ResultadoJuicio extends ResultadoParseoJuez {
  pregunta: string;
  respuesta: string;
}

function validarRubrica(rubrica: RubricaEvaluacion[]): void {
  if (rubrica.length === 0) throw new Error("La rúbrica debe contener al menos una dimensión");
  const nombres = new Set<string>();
  let pesoTotal = 0;
  for (const dimension of rubrica) {
    if (!dimension.nombre.trim()) throw new Error("Toda dimensión necesita nombre");
    if (nombres.has(dimension.nombre)) throw new Error(`Dimensión duplicada: ${dimension.nombre}`);
    if (!Number.isFinite(dimension.peso) || dimension.peso <= 0) {
      throw new Error(`Peso inválido en ${dimension.nombre}`);
    }
    nombres.add(dimension.nombre);
    pesoTotal += dimension.peso;
  }
  if (pesoTotal <= 0) throw new Error("La suma de pesos debe ser positiva");
}

function veredictoDesdeScore(score: number): Exclude<VeredictoJuicio, "invalido"> {
  return score >= 9 ? "excelente"
    : score >= 7 ? "bueno"
    : score >= 5 ? "aceptable"
    : score >= 3 ? "mejorable"
    : "deficiente";
}

export function parsearSalidaJuez(
  texto: string,
  rubrica: RubricaEvaluacion[] = RUBRICA_ESTANDAR,
): ResultadoParseoJuez {
  validarRubrica(rubrica);
  const errores: string[] = [];
  const porDimension = new Map<string, ScoreEvaluacion>();
  const nombresEsperados = new Set(rubrica.map((r) => r.nombre));

  for (const lineaCruda of texto.split(/\r?\n/)) {
    const linea = lineaCruda.trim();
    if (!/^DIMENSION:/i.test(linea)) continue;

    const match = linea.match(
      /^DIMENSION:\s*([^|]+?)\s*\|\s*SCORE:\s*([^|]+?)\s*\|\s*FEEDBACK:\s*(.+)$/i,
    );
    if (!match) {
      errores.push(`Línea de dimensión con formato inválido: ${linea.slice(0, 100)}`);
      continue;
    }

    const nombre = match[1].trim();
    const scoreTexto = match[2].trim();
    const feedback = match[3].trim();
    if (!nombresEsperados.has(nombre)) {
      errores.push(`Dimensión desconocida: ${nombre}`);
      continue;
    }
    if (porDimension.has(nombre)) {
      errores.push(`Dimensión duplicada en la salida: ${nombre}`);
      continue;
    }

    const score = Number(scoreTexto);
    if (!Number.isFinite(score) || score < 0 || score > 10) {
      porDimension.set(nombre, {
        dimension: nombre,
        score: null,
        feedback: feedback || null,
        valido: false,
        error: `Score fuera de rango o no numérico: ${scoreTexto}`,
      });
      errores.push(`${nombre}: score inválido (${scoreTexto})`);
      continue;
    }
    if (!feedback) {
      porDimension.set(nombre, {
        dimension: nombre,
        score: null,
        feedback: null,
        valido: false,
        error: "Feedback ausente",
      });
      errores.push(`${nombre}: feedback ausente`);
      continue;
    }

    porDimension.set(nombre, { dimension: nombre, score, feedback, valido: true });
  }

  const scores = rubrica.map((dimension): ScoreEvaluacion => {
    const encontrado = porDimension.get(dimension.nombre);
    if (encontrado) return encontrado;
    errores.push(`${dimension.nombre}: dimensión no evaluada`);
    return {
      dimension: dimension.nombre,
      score: null,
      feedback: null,
      valido: false,
      error: "Dimensión no evaluada",
    };
  });

  const recomendacionesMatch = texto.match(/^RECOMENDACIONES:\s*(.+)$/im);
  const recomendaciones = recomendacionesMatch?.[1]
    ?.split(";")
    .map((r) => r.trim())
    .filter(Boolean) ?? [];

  if (scores.some((score) => !score.valido || score.score === null) || errores.length > 0) {
    return {
      estado: "invalido",
      scores,
      scorePonderado: null,
      veredicto: "invalido",
      recomendaciones,
      errores,
    };
  }

  const pesoTotal = rubrica.reduce((sum, dimension) => sum + dimension.peso, 0);
  const scorePonderado = scores.reduce((total, score) => {
    const dimension = rubrica.find((r) => r.nombre === score.dimension)!;
    return total + score.score! * dimension.peso;
  }, 0) / pesoTotal;

  return {
    estado: "valido",
    scores,
    scorePonderado,
    veredicto: veredictoDesdeScore(scorePonderado),
    recomendaciones,
    errores: [],
  };
}

export class JuezLLM {
  private client: OpenAI;
  private rubrica: RubricaEvaluacion[];

  constructor(client: OpenAI = makeClient(), rubrica = RUBRICA_ESTANDAR) {
    validarRubrica(rubrica);
    this.client = client;
    this.rubrica = rubrica;
  }

  async juzgar(pregunta: string, respuesta: string): Promise<ResultadoJuicio> {
    const dimensionesStr = this.rubrica
      .map((r) => `${r.nombre} (peso: ${r.peso}): ${r.descripcion}`)
      .join("\n");

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions: `Eres un evaluador experto de calidad de respuestas de IA.\n\nPREGUNTA: "${pregunta}"\nRESPUESTA A EVALUAR: "${respuesta.slice(0, 2000)}"\n\nEvalúa TODAS estas dimensiones con score de 0 a 10:\n${dimensionesStr}\n\nDevuelve exactamente una línea por dimensión:\nDIMENSION: nombre | SCORE: 0-10 | FEEDBACK: comentario breve\nRECOMENDACIONES: mejora 1; mejora 2`,
      input: "",
    });

    return { pregunta, respuesta, ...parsearSalidaJuez(resp.output_text, this.rubrica) };
  }

  async compararRespuestas(
    pregunta: string,
    respuestas: string[],
  ): Promise<{ ranking: number[]; mejorIndice: number | null; indicesInvalidos: number[] }> {
    const juicios = await Promise.all(respuestas.map((respuesta) => this.juzgar(pregunta, respuesta)));
    const validos = juicios
      .map((juicio, indice) => ({ indice, score: juicio.scorePonderado }))
      .filter((item): item is { indice: number; score: number } => item.score !== null)
      .sort((a, b) => b.score - a.score);
    const indicesInvalidos = juicios
      .map((juicio, indice) => ({ juicio, indice }))
      .filter(({ juicio }) => juicio.estado === "invalido")
      .map(({ indice }) => indice);

    const empate = validos.length > 1 && Math.abs(validos[0].score - validos[1].score) < 1e-9;
    return {
      ranking: validos.map((item) => item.indice),
      mejorIndice: validos.length === 0 || empate ? null : validos[0].indice,
      indicesInvalidos,
    };
  }
}

export async function demostrarLLMAsJudge(client: OpenAI = makeClient()): Promise<void> {
  paso("⚖️", "Demostrando LLM-as-Judge con parsing fail-closed");
  const juez = new JuezLLM(client);
  const juicio = await juez.juzgar(
    "¿Qué es RAG y cuándo usarlo?",
    "RAG combina recuperación de documentos con generación para responder usando conocimiento externo actualizado.",
  );

  if (juicio.estado === "invalido") {
    console.log(`   🚫 Juicio inválido: ${juicio.errores.join("; ")}`);
    return;
  }
  console.log(`   ✅ Score ponderado: ${juicio.scorePonderado!.toFixed(2)}/10 → ${juicio.veredicto}`);
  paso("✅", "Las dimensiones ausentes ya no reciben scores favorables por defecto");
}

async function main(): Promise<void> { await demostrarLLMAsJudge(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
