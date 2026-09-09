/**
 * PATRÓN 75 — A/B TESTING FOR PROMPTS
 *
 * Distingue diferencia observada de evidencia estadística. No imputa
 * quality scores ausentes y no llama "significativo" a un margen bruto.
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface VariantePrompt {
  id: string;
  nombre: string;
  sistemaPrompt: string;
  descripcion: string;
}

export interface ResultadoEjecucion {
  varianteId: string;
  entrada: string;
  salida: string;
  latenciaMs: number;
  tokensEstimados: number;
}

export interface ResumenMuestra {
  n: number;
  media: number | null;
  desviacionEstandar: number | null;
  errorEstandar: number | null;
  ic95Media: [number, number] | null;
}

export interface MetricasVariante {
  varianteId: string;
  nombre: string;
  totalEjecuciones: number;
  latenciaPromedioMs: number | null;
  tokensPromedio: number | null;
  muestrasCalidad: number;
  scoreCalidad: number | null;
  desviacionCalidad: number | null;
  ic95Calidad: [number, number] | null;
}

export type EstadoComparacion = "insuficiente" | "inconclusa" | "diferencia_detectada";

export interface ComparacionCalidad {
  estado: EstadoComparacion;
  diferenciaMedia: number | null;
  errorEstandarDiferencia: number | null;
  ic95Diferencia: [number, number] | null;
  varianteSuperiorId: string | null;
  nota: string;
}

export interface ResultadoABTest {
  ganador: string | null;
  margenVictoria: number | null;
  metricas: MetricasVariante[];
  comparacion: ComparacionCalidad;
  recomendacion: string;
}

export type EvaluadorCalidad = (respuesta: string, pregunta: string) => Promise<number | null>;

function media(valores: number[]): number {
  return valores.reduce((sum, valor) => sum + valor, 0) / valores.length;
}

export function resumirMuestra(valores: number[]): ResumenMuestra {
  if (valores.length === 0) {
    return { n: 0, media: null, desviacionEstandar: null, errorEstandar: null, ic95Media: null };
  }
  const promedio = media(valores);
  if (valores.length === 1) {
    return { n: 1, media: promedio, desviacionEstandar: null, errorEstandar: null, ic95Media: null };
  }
  const varianza = valores.reduce((sum, valor) => sum + (valor - promedio) ** 2, 0) / (valores.length - 1);
  const desviacion = Math.sqrt(varianza);
  const error = desviacion / Math.sqrt(valores.length);
  const margen = 1.96 * error;
  return {
    n: valores.length,
    media: promedio,
    desviacionEstandar: desviacion,
    errorEstandar: error,
    ic95Media: [promedio - margen, promedio + margen],
  };
}

export function compararMuestrasCalidad(
  varianteAId: string,
  valoresA: number[],
  varianteBId: string,
  valoresB: number[],
): ComparacionCalidad {
  if (valoresA.length < 2 || valoresB.length < 2) {
    return {
      estado: "insuficiente",
      diferenciaMedia: null,
      errorEstandarDiferencia: null,
      ic95Diferencia: null,
      varianteSuperiorId: null,
      nota: "Se requieren al menos 2 observaciones de calidad válidas por variante para estimar incertidumbre.",
    };
  }

  const a = resumirMuestra(valoresA);
  const b = resumirMuestra(valoresB);
  const diferencia = a.media! - b.media!;
  const varA = a.desviacionEstandar! ** 2;
  const varB = b.desviacionEstandar! ** 2;
  const se = Math.sqrt(varA / a.n + varB / b.n);
  const margen = 1.96 * se;
  const intervalo: [number, number] = [diferencia - margen, diferencia + margen];

  // Aproximación normal al 95 %. Para muestras pequeñas o decisiones críticas,
  // usar Welch-t exacto / bootstrap y un diseño experimental pre-registrado.
  if (intervalo[0] > 0) {
    return {
      estado: "diferencia_detectada",
      diferenciaMedia: diferencia,
      errorEstandarDiferencia: se,
      ic95Diferencia: intervalo,
      varianteSuperiorId: varianteAId,
      nota: "El IC95 aproximado de A-B está completamente por encima de 0.",
    };
  }
  if (intervalo[1] < 0) {
    return {
      estado: "diferencia_detectada",
      diferenciaMedia: diferencia,
      errorEstandarDiferencia: se,
      ic95Diferencia: intervalo,
      varianteSuperiorId: varianteBId,
      nota: "El IC95 aproximado de A-B está completamente por debajo de 0.",
    };
  }
  return {
    estado: "inconclusa",
    diferenciaMedia: diferencia,
    errorEstandarDiferencia: se,
    ic95Diferencia: intervalo,
    varianteSuperiorId: null,
    nota: "El IC95 aproximado de A-B incluye 0; no hay evidencia suficiente para declarar una variante superior.",
  };
}

function hashUnidad(unidad: string): number {
  let hash = 2166136261;
  for (let i = 0; i < unidad.length; i++) {
    hash ^= unidad.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export class ABTestingPrompts {
  private resultados: ResultadoEjecucion[] = [];

  constructor(
    private variantes: VariantePrompt[],
    private client: OpenAI = makeClient(),
    private evaluadorCalidad?: EvaluadorCalidad,
  ) {
    if (variantes.length !== 2) throw new Error("A/B Testing requiere exactamente dos variantes");
    if (new Set(variantes.map((v) => v.id)).size !== 2) throw new Error("Los IDs de variantes deben ser únicos");
  }

  private seleccionarVariante(unidadExperimental?: string): VariantePrompt {
    if (unidadExperimental) {
      return this.variantes[hashUnidad(unidadExperimental) % this.variantes.length];
    }
    return this.variantes[Math.floor(Math.random() * this.variantes.length)];
  }

  async ejecutar(entrada: string, varianteId?: string, unidadExperimental?: string): Promise<ResultadoEjecucion> {
    const variante = varianteId
      ? this.variantes.find((v) => v.id === varianteId)
      : this.seleccionarVariante(unidadExperimental);
    if (!variante) throw new Error(`Variante desconocida: ${varianteId}`);

    const inicio = Date.now();
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: variante.sistemaPrompt,
      input: entrada,
    });

    const resultado: ResultadoEjecucion = {
      varianteId: variante.id,
      entrada,
      salida: resp.output_text,
      latenciaMs: Date.now() - inicio,
      tokensEstimados: Math.ceil((variante.sistemaPrompt + entrada + resp.output_text).split(/\s+/).length * 1.3),
    };
    this.resultados.push(resultado);
    return resultado;
  }

  private async evaluar(respuesta: string, pregunta: string): Promise<number | null> {
    if (this.evaluadorCalidad) return this.evaluadorCalidad(respuesta, pregunta);
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: "Evalúa relevancia, claridad y completitud de 0 a 100. Responde exclusivamente con un número.",
      input: `Pregunta: ${pregunta}\nRespuesta: ${respuesta.slice(0, 1000)}`,
    });
    const match = resp.output_text.trim().match(/^(\d{1,3}(?:\.\d+)?)$/);
    if (!match) return null;
    const score = Number(match[1]);
    return Number.isFinite(score) && score >= 0 && score <= 100 ? score : null;
  }

  async analizarResultados(entradasEvaluacion: string[]): Promise<ResultadoABTest> {
    const entradas = new Set(entradasEvaluacion);
    const datos = new Map<string, { latencias: number[]; tokens: number[]; scores: number[] }>();
    this.variantes.forEach((v) => datos.set(v.id, { latencias: [], tokens: [], scores: [] }));

    for (const resultado of this.resultados) {
      const bucket = datos.get(resultado.varianteId)!;
      bucket.latencias.push(resultado.latenciaMs);
      bucket.tokens.push(resultado.tokensEstimados);
      if (entradas.has(resultado.entrada)) {
        const score = await this.evaluar(resultado.salida, resultado.entrada);
        if (score !== null) bucket.scores.push(score);
      }
    }

    const metricas = this.variantes.map((variante): MetricasVariante => {
      const bucket = datos.get(variante.id)!;
      const resumen = resumirMuestra(bucket.scores);
      return {
        varianteId: variante.id,
        nombre: variante.nombre,
        totalEjecuciones: bucket.latencias.length,
        latenciaPromedioMs: bucket.latencias.length ? Math.round(media(bucket.latencias)) : null,
        tokensPromedio: bucket.tokens.length ? Math.round(media(bucket.tokens)) : null,
        muestrasCalidad: resumen.n,
        scoreCalidad: resumen.media,
        desviacionCalidad: resumen.desviacionEstandar,
        ic95Calidad: resumen.ic95Media,
      };
    });

    const [a, b] = this.variantes;
    const comparacion = compararMuestrasCalidad(a.id, datos.get(a.id)!.scores, b.id, datos.get(b.id)!.scores);
    const ganadorVariante = comparacion.varianteSuperiorId
      ? this.variantes.find((v) => v.id === comparacion.varianteSuperiorId) ?? null
      : null;

    return {
      ganador: ganadorVariante?.nombre ?? null,
      margenVictoria: comparacion.diferenciaMedia === null ? null : Math.abs(comparacion.diferenciaMedia),
      metricas,
      comparacion,
      recomendacion: ganadorVariante
        ? `La evidencia disponible favorece a "${ganadorVariante.nombre}"; confirma el resultado con el diseño estadístico apropiado antes de un rollout crítico.`
        : comparacion.estado === "insuficiente"
          ? "No hay suficientes observaciones válidas por brazo; continúa el experimento sin imputar scores ausentes."
          : "Resultado inconcluso: el intervalo de la diferencia incluye 0. No declares ganador con estos datos.",
    };
  }
}

export async function demostrarABTesting(client: OpenAI = makeClient()): Promise<void> {
  paso("🧪", "Demostrando A/B Testing con incertidumbre explícita");
  const variantes: VariantePrompt[] = [
    { id: "A", nombre: "Directo", sistemaPrompt: "Responde de forma concisa.", descripcion: "Prompt breve" },
    { id: "B", nombre: "Estructurado", sistemaPrompt: "Define, ejemplifica y explica cuándo usarlo.", descripcion: "Prompt estructurado" },
  ];
  const ab = new ABTestingPrompts(variantes, client);
  const preguntas = ["¿Qué es RAG?", "¿Qué es Observer?", "¿Qué es Circuit Breaker?"];
  for (const pregunta of preguntas) {
    for (const variante of variantes) await ab.ejecutar(pregunta, variante.id);
  }
  const resultado = await ab.analizarResultados(preguntas);
  console.log(`   Estado inferencial: ${resultado.comparacion.estado}`);
  console.log(`   IC95 diferencia A-B: ${JSON.stringify(resultado.comparacion.ic95Diferencia)}`);
  console.log(`   Recomendación: ${resultado.recomendacion}`);
  paso("✅", "La diferencia observada ya no se confunde con evidencia estadística");
}

async function main(): Promise<void> { await demostrarABTesting(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
