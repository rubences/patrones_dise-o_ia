/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 77 — OBSERVABILITY & TRACING (OBSERVABILIDAD Y TRAZADO)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Agente ejecuta acción]
 *       │
 *       ▼
 *  [Span Tracer]
 *  ├─ span.start("llm-call")
 *  │    ├─ input: {prompt, tokens}
 *  │    ├─ output: {respuesta, tokens}
 *  │    ├─ duration: 1250ms
 *  │    └─ status: ok
 *  └─ span.end()
 *
 *  [Árbol de Trazas]
 *  Request
 *  └─ Router (50ms)
 *     └─ RAG: recover (200ms)
 *        └─ LLM call (1200ms)
 *           └─ Output parser (5ms)
 *
 *  Idea: Instrumentar cada paso del agente con trazas y métricas
 *  para observar el comportamiento real en producción.
 *
 *  Ventajas:
 *  - Visibilidad completa del flujo de ejecución
 *  - Detección de cuellos de botella
 *  - Debugging de comportamientos inesperados
 *  - Base para alertas y dashboards
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface Span {
  id: string;
  nombre: string;
  padreId?: string;
  inicio: number;
  fin?: number;
  duracionMs?: number;
  atributos: Record<string, unknown>;
  estado: "ok" | "error" | "en-progreso";
  error?: string;
  hijos: Span[];
}

export class Tracer {
  private trazas: Span[] = [];
  private spanActivo: Span | null = null;

  iniciarSpan(nombre: string, atributos: Record<string, unknown> = {}): Span {
    const span: Span = {
      id: `span-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      nombre,
      padreId: this.spanActivo?.id,
      inicio: Date.now(),
      atributos,
      estado: "en-progreso",
      hijos: [],
    };

    if (this.spanActivo) {
      this.spanActivo.hijos.push(span);
    } else {
      this.trazas.push(span);
    }

    const anterior = this.spanActivo;
    this.spanActivo = span;

    // Devolver objeto con cierre automático
    (span as Span & { cerrar: (atributosExtra?: Record<string, unknown>) => void }).cerrar =
      (atributosExtra?: Record<string, unknown>) => {
        span.fin = Date.now();
        span.duracionMs = span.fin - span.inicio;
        span.estado = "ok";
        if (atributosExtra) Object.assign(span.atributos, atributosExtra);
        this.spanActivo = anterior;
      };

    return span;
  }

  cerrarSpanConError(span: Span, error: string): void {
    span.fin = Date.now();
    span.duracionMs = (span.fin || Date.now()) - span.inicio;
    span.estado = "error";
    span.error = error;
  }

  async trazar<T>(
    nombre: string,
    atributos: Record<string, unknown>,
    operacion: (span: Span) => Promise<T>,
  ): Promise<T> {
    const span = this.iniciarSpan(nombre, atributos);
    try {
      const resultado = await operacion(span);
      (span as Span & { cerrar: (a?: Record<string, unknown>) => void }).cerrar?.();
      return resultado;
    } catch (error) {
      this.cerrarSpanConError(span, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  obtenerTrazas(): Span[] {
    return [...this.trazas];
  }

  imprimirArbol(span: Span = this.trazas[0], nivel = 0): void {
    if (!span) return;
    const indent = "  ".repeat(nivel);
    const estado = span.estado === "ok" ? "✅" : span.estado === "error" ? "❌" : "⏳";
    const duracion = span.duracionMs ? `${span.duracionMs}ms` : "en curso";
    console.log(`   ${indent}${estado} ${span.nombre} (${duracion})`);

    // Mostrar atributos relevantes
    if (span.atributos.tokensUsados) {
      console.log(`   ${indent}   tokens: ${span.atributos.tokensUsados}`);
    }
    if (span.error) {
      console.log(`   ${indent}   error: ${span.error}`);
    }

    span.hijos.forEach((hijo) => this.imprimirArbol(hijo, nivel + 1));
  }

  obtenerMetricas(): {
    totalSpans: number;
    duracionTotal: number;
    errores: number;
    spanMasLento: string;
  } {
    const todos = this.aplanarSpans(this.trazas);
    const completados = todos.filter((s) => s.duracionMs !== undefined);

    const spanMasLento = completados.reduce(
      (a, b) => ((a.duracionMs ?? 0) > (b.duracionMs ?? 0) ? a : b),
      completados[0] ?? { nombre: "ninguno", duracionMs: 0 },
    );

    return {
      totalSpans: todos.length,
      duracionTotal: completados.reduce((s, sp) => s + (sp.duracionMs ?? 0), 0),
      errores: todos.filter((s) => s.estado === "error").length,
      spanMasLento: `${spanMasLento.nombre} (${spanMasLento.duracionMs}ms)`,
    };
  }

  private aplanarSpans(spans: Span[]): Span[] {
    return spans.flatMap((s) => [s, ...this.aplanarSpans(s.hijos)]);
  }
}

export class AgenteInstrumentado {
  private tracer: Tracer;
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
    this.tracer = new Tracer();
  }

  async procesarConTrazas(consulta: string): Promise<string> {
    return this.tracer.trazar("request.procesar", { consulta: consulta.slice(0, 50) }, async (spanRaiz) => {
      // Simular RAG
      const docs = await this.tracer.trazar(
        "rag.recuperar",
        { topK: 3 },
        async () => {
          await new Promise((r) => setTimeout(r, 80));
          return ["doc1", "doc2", "doc3"];
        },
      );

      // LLM call
      const respuesta = await this.tracer.trazar(
        "llm.completar",
        { modelo: DEFAULT_MODEL },
        async (span) => {
          const r = await this.client.responses.create({
            model: DEFAULT_MODEL,
            reasoning: { effort: "low" },
            store: false,
            instructions: `Responde brevemente: ${consulta}`,
            input: "",
          });
          const tokens = Math.ceil(r.output_text.split(" ").length * 1.3);
          span.atributos.tokensUsados = tokens;
          return r.output_text;
        },
      );

      // Output parser
      await this.tracer.trazar("parser.output", {}, async () => {
        return respuesta.trim();
      });

      spanRaiz.atributos.docsRecuperados = docs.length;
      return respuesta;
    });
  }

  obtenerTracer(): Tracer {
    return this.tracer;
  }
}

export async function demostrarObservability(client: OpenAI = makeClient()): Promise<void> {
  paso("🔭", "Demostrando Observability & Tracing Pattern");

  const agente = new AgenteInstrumentado(client);

  paso("1️⃣", "Ejecutar agente instrumentado");
  const respuesta = await agente.procesarConTrazas("¿Qué es el patrón Observer?");
  console.log(`\n   Respuesta: "${respuesta.slice(0, 100)}..."\n`);

  paso("2️⃣", "Árbol de trazas");
  const trazer = agente.obtenerTracer();
  trazer.obtenerTrazas().forEach((t) => trazer.imprimirArbol(t));

  paso("3️⃣", "Métricas agregadas");
  const metricas = trazer.obtenerMetricas();
  console.log(`\n   Total spans: ${metricas.totalSpans}`);
  console.log(`   Duración total: ${metricas.duracionTotal}ms`);
  console.log(`   Errores: ${metricas.errores}`);
  console.log(`   Span más lento: ${metricas.spanMasLento}`);

  paso("✅", "Observability proporcionando visibilidad completa del flujo agéntico");
}

async function main(): Promise<void> { await demostrarObservability(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
