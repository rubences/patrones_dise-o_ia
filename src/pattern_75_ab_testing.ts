/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 75 — A/B TESTING FOR PROMPTS (PRUEBAS A/B DE PROMPTS)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Usuarios]
 *       │
 *   ┌───┴───┐
 *   50%     50%
 *   ▼       ▼
 *  [Prompt A]  [Prompt B]
 *   │           │
 *   ▼           ▼
 *  Respuesta A  Respuesta B
 *   │           │
 *   └─────┬─────┘
 *         │
 *   [Métricas]
 *   ├─ Calidad (LLM-as-Judge)
 *   ├─ Latencia
 *   ├─ Tokens usados
 *   └─ Score usuario (simulado)
 *
 *  Ventajas:
 *  - Optimización basada en evidencia
 *  - Comparación objetiva de variantes
 *  - Mejora continua de prompts
 *  - Cuantificación del impacto de cambios
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

export interface MetricasVariante {
  varianteId: string;
  nombre: string;
  totalEjecuciones: number;
  latenciaPromedioMs: number;
  tokensPromedio: number;
  scoreCalidad: number; // 0-100 evaluado por LLM-as-Judge
}

export interface ResultadoABTest {
  ganador: string;
  margenVictoria: number;
  metricas: MetricasVariante[];
  recomendacion: string;
}

export class ABTestingPrompts {
  private client: OpenAI;
  private variantes: VariantePrompt[];
  private resultados: ResultadoEjecucion[] = [];

  constructor(variantes: VariantePrompt[], client: OpenAI = makeClient()) {
    this.client = client;
    this.variantes = variantes;
  }

  private seleccionarVariante(): VariantePrompt {
    // Distribución uniforme entre variantes
    return this.variantes[Math.floor(Math.random() * this.variantes.length)];
  }

  async ejecutar(entrada: string, varianteId?: string): Promise<ResultadoEjecucion> {
    const variante = varianteId
      ? this.variantes.find((v) => v.id === varianteId) ?? this.seleccionarVariante()
      : this.seleccionarVariante();

    const inicio = Date.now();
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `${variante.sistemaPrompt}\n\n${entrada}`,
      input: "",
    });

    const resultado: ResultadoEjecucion = {
      varianteId: variante.id,
      entrada,
      salida: resp.output_text,
      latenciaMs: Date.now() - inicio,
      tokensEstimados: Math.ceil((variante.sistemaPrompt + entrada + resp.output_text).split(" ").length * 1.3),
    };

    this.resultados.push(resultado);
    return resultado;
  }

  private async evaluarCalidad(respuesta: string, pregunta: string): Promise<number> {
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Evalúa la calidad de esta respuesta del 0-100.
Pregunta: "${pregunta}"
Respuesta: "${respuesta.slice(0, 200)}"
Considera: relevancia, claridad, completitud.
Responde SOLO con el número.`,
      input: "",
    });
    return parseInt(resp.output_text.match(/\d+/)?.[0] ?? "70");
  }

  async analizarResultados(entradasEvaluacion: string[]): Promise<ResultadoABTest> {
    console.log(`\n   📊 Analizando ${this.resultados.length} ejecuciones...`);

    const metricasPorVariante = new Map<string, { latencias: number[]; tokens: number[]; scores: number[] }>();

    // Inicializar
    this.variantes.forEach((v) => metricasPorVariante.set(v.id, { latencias: [], tokens: [], scores: [] }));

    // Agregar métricas
    for (const r of this.resultados) {
      const m = metricasPorVariante.get(r.varianteId);
      if (m) {
        m.latencias.push(r.latenciaMs);
        m.tokens.push(r.tokensEstimados);
        // Evaluar calidad de algunas respuestas
        if (entradasEvaluacion.includes(r.entrada)) {
          const score = await this.evaluarCalidad(r.salida, r.entrada);
          m.scores.push(score);
        }
      }
    }

    const metricas: MetricasVariante[] = this.variantes.map((v) => {
      const m = metricasPorVariante.get(v.id) ?? { latencias: [0], tokens: [0], scores: [70] };
      return {
        varianteId: v.id,
        nombre: v.nombre,
        totalEjecuciones: m.latencias.length,
        latenciaPromedioMs: Math.round(m.latencias.reduce((s, l) => s + l, 0) / m.latencias.length),
        tokensPromedio: Math.round(m.tokens.reduce((s, t) => s + t, 0) / m.tokens.length),
        scoreCalidad: m.scores.length > 0 ? Math.round(m.scores.reduce((s, sc) => s + sc, 0) / m.scores.length) : 70,
      };
    });

    const ganadorMetrica = metricas.sort((a, b) => b.scoreCalidad - a.scoreCalidad)[0];
    const segundoMetrica = metricas[1];
    const margen = ganadorMetrica.scoreCalidad - (segundoMetrica?.scoreCalidad ?? 0);

    return {
      ganador: ganadorMetrica.nombre,
      margenVictoria: margen,
      metricas,
      recomendacion: margen >= 10
        ? `Adoptar "${ganadorMetrica.nombre}" en producción (margen significativo: ${margen} puntos)`
        : `Diferencia no concluyente (${margen} puntos). Recomendado: más muestras.`,
    };
  }
}

export async function demostrarABTesting(client: OpenAI = makeClient()): Promise<void> {
  paso("🧪", "Demostrando A/B Testing for Prompts Pattern");

  const variantes: VariantePrompt[] = [
    {
      id: "A",
      nombre: "Prompt-Directo",
      sistemaPrompt: "Responde de forma concisa y directa.",
      descripcion: "Sistema prompt minimalista",
    },
    {
      id: "B",
      nombre: "Prompt-Estructurado",
      sistemaPrompt: "Eres un experto en patrones de diseño. Responde estructuradamente: primero la definición, luego un ejemplo, finalmente cuándo usarlo.",
      descripcion: "Sistema prompt con estructura explícita",
    },
  ];

  const ab = new ABTestingPrompts(variantes, client);

  const preguntas = [
    "¿Qué es el patrón Singleton?",
    "¿Cuándo usar Factory Method?",
    "Explica el patrón Observer",
  ];

  paso("1️⃣", "Ejecutar cada variante con las mismas preguntas");
  for (const pregunta of preguntas) {
    for (const variante of variantes) {
      const r = await ab.ejecutar(pregunta, variante.id);
      console.log(`   [${variante.nombre}] "${pregunta.slice(0, 35)}" → ${r.latenciaMs}ms | ${r.tokensEstimados} tokens`);
    }
  }

  paso("2️⃣", "Analizar y comparar resultados");
  const resultado = await ab.analizarResultados([preguntas[0]]);

  console.log(`\n   📊 Resultados A/B Test:`);
  resultado.metricas.forEach((m) => {
    console.log(`   ${m.nombre}: calidad=${m.scoreCalidad}/100 | latencia=${m.latenciaPromedioMs}ms | tokens=${m.tokensPromedio}`);
  });
  console.log(`\n   🏆 Ganador: ${resultado.ganador} (margen: +${resultado.margenVictoria} puntos)`);
  console.log(`   📋 Recomendación: ${resultado.recomendacion}`);

  paso("✅", "A/B Testing comparando variantes de prompts con métricas objetivas");
}

async function main(): Promise<void> { await demostrarABTesting(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
