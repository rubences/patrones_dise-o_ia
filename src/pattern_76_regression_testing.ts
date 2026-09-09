/**
 * PATRÓN 76 — REGRESSION TESTING FOR LLMs
 *
 * Los baselines son artefactos versionados y persistibles. Un fallo de
 * parsing del evaluador no se convierte en una nota sintética favorable.
 */

import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface TestGolden {
  id: string;
  descripcion: string;
  input: string;
  expectedKeywords: string[];
  forbiddenKeywords: string[];
  scoreMinimo: number;
}

export type EstadoTest = "pasado" | "fallido" | "degradado" | "invalido";

export interface ResultadoTest {
  test: TestGolden;
  respuesta: string;
  scoreObtenido: number | null;
  keywordsFaltantes: string[];
  keywordsProhibidasEncontradas: string[];
  estado: EstadoTest;
  detalles: string;
}

export interface BaselineTest {
  score: number | null;
  estado: EstadoTest;
}

export interface SnapshotBaseline {
  version: string;
  creadoEn: string;
  tests: Record<string, BaselineTest>;
}

export interface BaselineStore {
  cargar(version: string): SnapshotBaseline | null;
  guardar(snapshot: SnapshotBaseline): void;
}

export class MemoryBaselineStore implements BaselineStore {
  private snapshots = new Map<string, SnapshotBaseline>();
  cargar(version: string): SnapshotBaseline | null {
    const snapshot = this.snapshots.get(version);
    return snapshot ? structuredClone(snapshot) : null;
  }
  guardar(snapshot: SnapshotBaseline): void {
    this.snapshots.set(snapshot.version, structuredClone(snapshot));
  }
}

interface ArchivoBaselines { versions: Record<string, SnapshotBaseline>; }

export class JsonFileRegressionBaselineStore implements BaselineStore {
  constructor(private ruta: string) {}

  private leer(): ArchivoBaselines {
    try {
      const parsed = JSON.parse(readFileSync(this.ruta, "utf8")) as ArchivoBaselines;
      return parsed && typeof parsed === "object" && parsed.versions ? parsed : { versions: {} };
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "ENOENT") return { versions: {} };
      throw error;
    }
  }

  cargar(version: string): SnapshotBaseline | null {
    return this.leer().versions[version] ?? null;
  }

  guardar(snapshot: SnapshotBaseline): void {
    const data = this.leer();
    data.versions[snapshot.version] = snapshot;
    mkdirSync(dirname(this.ruta), { recursive: true });
    const temporal = `${this.ruta}.${process.pid}.${Date.now()}.tmp`;
    writeFileSync(temporal, JSON.stringify(data, null, 2), "utf8");
    renameSync(temporal, this.ruta);
  }
}

export interface ReporteRegresion {
  version: string;
  baselineComparado: string | null;
  timestamp: Date;
  totalTests: number;
  pasados: number;
  fallidos: number;
  degradados: number;
  invalidos: number;
  tasaExito: number;
  resultados: ResultadoTest[];
  regresionesDetectadas: string[];
}

export type EvaluadorCalidadRegresion = (test: TestGolden, respuesta: string) => Promise<number | null>;

export class SuiteRegresionLLM {
  private tests: TestGolden[];

  constructor(
    private client: OpenAI = makeClient(),
    private baselineStore: BaselineStore = new MemoryBaselineStore(),
    private evaluador?: EvaluadorCalidadRegresion,
  ) {
    this.tests = this.definirTestsGolden();
  }

  private definirTestsGolden(): TestGolden[] {
    return [
      {
        id: "T01",
        descripcion: "Definición básica de RAG",
        input: "¿Qué es RAG en inteligencia artificial?",
        expectedKeywords: ["recuperación", "generación"],
        forbiddenKeywords: ["no sé", "desconozco"],
        scoreMinimo: 70,
      },
      {
        id: "T02",
        descripcion: "Diferencia Factory vs Abstract Factory",
        input: "¿Cuál es la diferencia entre Factory Method y Abstract Factory?",
        expectedKeywords: ["familia", "creación"],
        forbiddenKeywords: ["son iguales", "no hay diferencia"],
        scoreMinimo: 65,
      },
      {
        id: "T03",
        descripcion: "Caso de uso de Singleton",
        input: "¿Cuándo usar el patrón Singleton?",
        expectedKeywords: ["única instancia", "recurso"],
        forbiddenKeywords: [],
        scoreMinimo: 60,
      },
      {
        id: "T04",
        descripcion: "Observer en español",
        input: "Explica brevemente el patrón Observer",
        expectedKeywords: ["observador", "notificar", "cambio"],
        forbiddenKeywords: [],
        scoreMinimo: 65,
      },
    ];
  }

  agregarTest(test: TestGolden): void {
    if (this.tests.some((existente) => existente.id === test.id)) throw new Error(`Test duplicado: ${test.id}`);
    this.tests.push(test);
  }

  private async scoreCalidad(test: TestGolden, respuesta: string): Promise<number | null> {
    if (this.evaluador) return this.evaluador(test, respuesta);
    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: "Evalúa la calidad de 0 a 100. Responde exclusivamente con un número.",
      input: `Pregunta: ${test.input}\nRespuesta: ${respuesta.slice(0, 1000)}`,
    });
    const match = resp.output_text.trim().match(/^(\d{1,3}(?:\.\d+)?)$/);
    if (!match) return null;
    const score = Number(match[1]);
    return Number.isFinite(score) && score >= 0 && score <= 100 ? score : null;
  }

  private async evaluarRespuesta(test: TestGolden, respuesta: string): Promise<ResultadoTest> {
    const lower = respuesta.toLowerCase();
    const keywordsFaltantes = test.expectedKeywords.filter((kw) => !lower.includes(kw.toLowerCase()));
    const keywordsProhibidasEncontradas = test.forbiddenKeywords.filter((kw) => lower.includes(kw.toLowerCase()));
    const scoreJuez = await this.scoreCalidad(test, respuesta);

    if (scoreJuez === null) {
      return {
        test,
        respuesta: respuesta.slice(0, 500),
        scoreObtenido: null,
        keywordsFaltantes,
        keywordsProhibidasEncontradas,
        estado: "invalido",
        detalles: "Evaluador inválido o no parseable; no se imputó score.",
      };
    }

    const penalizacion = keywordsFaltantes.length * 5 + keywordsProhibidasEncontradas.length * 15;
    const scoreFinal = Math.max(0, scoreJuez - penalizacion);
    const estado: EstadoTest =
      scoreFinal >= test.scoreMinimo && keywordsProhibidasEncontradas.length === 0
        ? "pasado"
        : scoreFinal >= test.scoreMinimo * 0.8
          ? "degradado"
          : "fallido";

    return {
      test,
      respuesta: respuesta.slice(0, 500),
      scoreObtenido: scoreFinal,
      keywordsFaltantes,
      keywordsProhibidasEncontradas,
      estado,
      detalles: `Score: ${scoreFinal}/${test.scoreMinimo}; faltan=[${keywordsFaltantes.join(", ")}]`,
    };
  }

  private snapshot(version: string, resultados: ResultadoTest[]): SnapshotBaseline {
    return {
      version,
      creadoEn: new Date().toISOString(),
      tests: Object.fromEntries(resultados.map((r) => [r.test.id, { score: r.scoreObtenido, estado: r.estado }])),
    };
  }

  async ejecutar(
    handler: (input: string) => Promise<string>,
    version = "v-actual",
    compararContra?: string,
  ): Promise<ReporteRegresion> {
    const baseline = compararContra ? this.baselineStore.cargar(compararContra) : null;
    if (compararContra && !baseline) throw new Error(`Baseline no encontrado: ${compararContra}`);

    const resultados: ResultadoTest[] = [];
    for (const test of this.tests) {
      const respuesta = await handler(test.input);
      resultados.push(await this.evaluarRespuesta(test, respuesta));
    }

    const regresionesDetectadas: string[] = [];
    if (baseline) {
      for (const actual of resultados) {
        const anterior = baseline.tests[actual.test.id];
        if (!anterior) continue;
        if (anterior.estado === "pasado" && actual.estado !== "pasado") {
          regresionesDetectadas.push(`[${actual.test.id}] Estado: pasado → ${actual.estado}`);
          continue;
        }
        if (anterior.score !== null && actual.scoreObtenido !== null && actual.scoreObtenido < anterior.score - 10) {
          regresionesDetectadas.push(`[${actual.test.id}] Score: ${anterior.score} → ${actual.scoreObtenido}`);
        }
      }
    }

    this.baselineStore.guardar(this.snapshot(version, resultados));
    const pasados = resultados.filter((r) => r.estado === "pasado").length;
    const fallidos = resultados.filter((r) => r.estado === "fallido").length;
    const degradados = resultados.filter((r) => r.estado === "degradado").length;
    const invalidos = resultados.filter((r) => r.estado === "invalido").length;

    return {
      version,
      baselineComparado: baseline?.version ?? null,
      timestamp: new Date(),
      totalTests: resultados.length,
      pasados,
      fallidos,
      degradados,
      invalidos,
      tasaExito: resultados.length ? Math.round((pasados / resultados.length) * 100) : 0,
      resultados,
      regresionesDetectadas,
    };
  }
}

export async function demostrarRegressionTesting(client: OpenAI = makeClient()): Promise<void> {
  paso("🧪", "Demostrando Regression Testing con baseline versionado");
  const store = new MemoryBaselineStore();
  const suite = new SuiteRegresionLLM(client, store);
  const agente = async (input: string): Promise<string> => {
    const resp = await client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: "Responde en español de forma concisa.",
      input,
    });
    return resp.output_text;
  };

  await suite.ejecutar(agente, "v1.0");
  const reporte = await suite.ejecutar(agente, "v1.1", "v1.0");
  console.log(`   Baseline comparado: ${reporte.baselineComparado}`);
  console.log(`   Regresiones: ${reporte.regresionesDetectadas.length}`);
  paso("✅", "Usa JsonFileRegressionBaselineStore para conservar baselines entre procesos");
}

async function main(): Promise<void> { await demostrarRegressionTesting(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
