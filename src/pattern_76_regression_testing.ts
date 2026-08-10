/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 76 — REGRESSION TESTING FOR LLMs (PRUEBAS DE REGRESIÓN)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Suite de Tests Golden]
 *  ├─ Test 1: {input, expected_output, tolerance}
 *  ├─ Test 2: {input, expected_output, tolerance}
 *  └─ Test N: ...
 *
 *       │
 *       ▼ (ejecutar contra nueva versión del agente)
 *
 *  [Evaluador Semántico]
 *  ├─ Similitud semántica vs expected
 *  ├─ Check de keywords obligatorias
 *  └─ Score de calidad (LLM-as-Judge)
 *
 *       │
 *       ▼
 *  [Reporte de Regresión]
 *  ├─ Tests pasados: 45/50 (90%)
 *  ├─ Regresiones: 3 tests que antes pasaban ahora fallan
 *  └─ Mejoras: 2 tests que antes fallaban ahora pasan
 *
 *  Ventajas:
 *  - Detectar regresiones al cambiar modelos o prompts
 *  - Golden tests que no deben romperse
 *  - CI/CD para sistemas LLM
 *  - Historial de calidad a lo largo del tiempo
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface TestGolden {
  id: string;
  descripcion: string;
  input: string;
  expectedKeywords: string[];    // Palabras que DEBEN aparecer
  forbiddenKeywords: string[];   // Palabras que NO deben aparecer
  scoreMinimo: number;           // Score mínimo aceptable (0-100)
}

export type EstadoTest = "pasado" | "fallido" | "degradado";

export interface ResultadoTest {
  test: TestGolden;
  respuesta: string;
  scoreObtenido: number;
  keywordsFaltantes: string[];
  keywordsProhibidasEncontradas: string[];
  estado: EstadoTest;
  detalles: string;
}

export interface ReporteRegresion {
  version: string;
  timestamp: Date;
  totalTests: number;
  pasados: number;
  fallidos: number;
  degradados: number;
  tasaExito: number;
  resultados: ResultadoTest[];
  regresionesDetectadas: string[];
}

export class SuiteRegresionLLM {
  private tests: TestGolden[];
  private client: OpenAI;
  private historial: Map<string, number> = new Map(); // testId → score anterior

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
    this.tests = this.definirTestsGolden();
  }

  private definirTestsGolden(): TestGolden[] {
    return [
      {
        id: "T01",
        descripcion: "Definición básica de RAG",
        input: "¿Qué es RAG en inteligencia artificial?",
        expectedKeywords: ["recuperación", "generación", "documentos", "llm"],
        forbiddenKeywords: ["no sé", "desconozco"],
        scoreMinimo: 70,
      },
      {
        id: "T02",
        descripcion: "Diferencia Factory vs Abstract Factory",
        input: "¿Cuál es la diferencia entre Factory Method y Abstract Factory?",
        expectedKeywords: ["familia", "interfaz", "creación"],
        forbiddenKeywords: ["son iguales", "no hay diferencia"],
        scoreMinimo: 65,
      },
      {
        id: "T03",
        descripcion: "Caso de uso del patrón Singleton",
        input: "¿Cuándo usar el patrón Singleton?",
        expectedKeywords: ["única instancia", "global", "recurso"],
        forbiddenKeywords: [],
        scoreMinimo: 60,
      },
      {
        id: "T04",
        descripcion: "Respuesta en idioma correcto",
        input: "Explica brevemente el patrón Observer",
        expectedKeywords: ["observador", "notificar", "cambio", "suscribir"],
        forbiddenKeywords: ["observer", "notify"], // No debe responder en inglés
        scoreMinimo: 65,
      },
    ];
  }

  agregarTest(test: TestGolden): void {
    this.tests.push(test);
  }

  private async evaluarRespuesta(test: TestGolden, respuesta: string): Promise<ResultadoTest> {
    const respuestaLower = respuesta.toLowerCase();

    // Verificar keywords obligatorias
    const keywordsFaltantes = test.expectedKeywords.filter(
      (kw) => !respuestaLower.includes(kw.toLowerCase()),
    );

    // Verificar keywords prohibidas
    const keywordsProhibidasEncontradas = test.forbiddenKeywords.filter(
      (kw) => respuestaLower.includes(kw.toLowerCase()),
    );

    // Score de calidad via LLM
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Evalúa del 0-100 la calidad de esta respuesta a la pregunta dada.
Pregunta: "${test.input}"
Respuesta: "${respuesta.slice(0, 300)}"
Responde SOLO con el número.`,
      input: "",
    });

    const scoreObtenido = parseInt(resp.output_text.match(/\d+/)?.[0] ?? "60");

    // Ajuste por keywords
    const penalizacion = keywordsFaltantes.length * 5 + keywordsProhibidasEncontradas.length * 15;
    const scoreFinal = Math.max(0, scoreObtenido - penalizacion);

    const estado: EstadoTest =
      scoreFinal >= test.scoreMinimo && keywordsProhibidasEncontradas.length === 0
        ? "pasado"
        : scoreFinal >= test.scoreMinimo * 0.8
        ? "degradado"
        : "fallido";

    return {
      test,
      respuesta: respuesta.slice(0, 200),
      scoreObtenido: scoreFinal,
      keywordsFaltantes,
      keywordsProhibidasEncontradas,
      estado,
      detalles: `Score: ${scoreFinal}/${test.scoreMinimo} | Faltan: [${keywordsFaltantes.join(", ")}]`,
    };
  }

  async ejecutar(
    handler: (input: string) => Promise<string>,
    version = "v-actual",
  ): Promise<ReporteRegresion> {
    console.log(`\n   🧪 Ejecutando suite de regresión (${this.tests.length} tests)...`);
    const resultados: ResultadoTest[] = [];

    for (const test of this.tests) {
      console.log(`   ▶️  [${test.id}] ${test.descripcion}`);
      const respuesta = await handler(test.input);
      const resultado = await this.evaluarRespuesta(test, respuesta);

      const icono = { pasado: "✅", fallido: "❌", degradado: "⚠️" }[resultado.estado];
      console.log(`   ${icono} Score: ${resultado.scoreObtenido}/${test.scoreMinimo}`);
      resultados.push(resultado);
    }

    // Detectar regresiones vs historial
    const regresiones: string[] = [];
    for (const r of resultados) {
      const scoreAnterior = this.historial.get(r.test.id);
      if (scoreAnterior !== undefined && r.scoreObtenido < scoreAnterior - 10) {
        regresiones.push(`[${r.test.id}] Regresión: ${scoreAnterior} → ${r.scoreObtenido}`);
      }
      this.historial.set(r.test.id, r.scoreObtenido);
    }

    const pasados = resultados.filter((r) => r.estado === "pasado").length;
    const fallidos = resultados.filter((r) => r.estado === "fallido").length;
    const degradados = resultados.filter((r) => r.estado === "degradado").length;

    return {
      version,
      timestamp: new Date(),
      totalTests: resultados.length,
      pasados,
      fallidos,
      degradados,
      tasaExito: Math.round((pasados / resultados.length) * 100),
      resultados,
      regresionesDetectadas: regresiones,
    };
  }
}

export async function demostrarRegressionTesting(client: OpenAI = makeClient()): Promise<void> {
  paso("🧪", "Demostrando Regression Testing for LLMs Pattern");

  const suite = new SuiteRegresionLLM(client);

  const agente = async (input: string): Promise<string> => {
    const resp = await client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Responde en español de forma concisa: ${input}`,
      input: "",
    });
    return resp.output_text;
  };

  paso("1️⃣", "Primera ejecución de la suite");
  const reporte1 = await suite.ejecutar(agente, "v1.0");

  console.log(`\n   📊 Reporte v1.0:`);
  console.log(`   Tests: ${reporte1.totalTests} | ✅ ${reporte1.pasados} | ⚠️  ${reporte1.degradados} | ❌ ${reporte1.fallidos}`);
  console.log(`   Tasa de éxito: ${reporte1.tasaExito}%`);

  paso("2️⃣", "Segunda ejecución (detecta regresiones vs anterior)");
  const reporte2 = await suite.ejecutar(agente, "v1.1");

  console.log(`\n   📊 Reporte v1.1:`);
  console.log(`   Tasa de éxito: ${reporte2.tasaExito}%`);
  if (reporte2.regresionesDetectadas.length > 0) {
    console.log(`   ⚠️  Regresiones: ${reporte2.regresionesDetectadas.join(", ")}`);
  } else {
    console.log(`   ✅ Sin regresiones detectadas`);
  }

  paso("✅", "Regression Testing garantizando calidad continua del agente");
}

async function main(): Promise<void> { await demostrarRegressionTesting(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
