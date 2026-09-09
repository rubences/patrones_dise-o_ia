/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 77 — OBSERVABILITY & TRACING
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Cada request mantiene su span activo en AsyncLocalStorage para que
 *  ejecuciones concurrentes no mezclen relaciones padre/hijo.
 */

import { AsyncLocalStorage } from "node:async_hooks";
import { OpenAI } from "openai";
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
  private contexto = new AsyncLocalStorage<Span>();

  iniciarSpan(nombre: string, atributos: Record<string, unknown> = {}): Span {
    const padre = this.contexto.getStore();
    const span: Span = {
      id: `span-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nombre,
      padreId: padre?.id,
      inicio: Date.now(),
      atributos,
      estado: "en-progreso",
      hijos: [],
    };

    if (padre) padre.hijos.push(span);
    else this.trazas.push(span);
    return span;
  }

  cerrarSpan(span: Span, atributosExtra?: Record<string, unknown>): void {
    span.fin = Date.now();
    span.duracionMs = span.fin - span.inicio;
    span.estado = "ok";
    if (atributosExtra) Object.assign(span.atributos, atributosExtra);
  }

  cerrarSpanConError(span: Span, error: string): void {
    span.fin = Date.now();
    span.duracionMs = span.fin - span.inicio;
    span.estado = "error";
    span.error = error;
  }

  async trazar<T>(
    nombre: string,
    atributos: Record<string, unknown>,
    operacion: (span: Span) => Promise<T>,
  ): Promise<T> {
    const span = this.iniciarSpan(nombre, atributos);

    return this.contexto.run(span, async () => {
      try {
        const resultado = await operacion(span);
        this.cerrarSpan(span);
        return resultado;
      } catch (error) {
        this.cerrarSpanConError(span, error instanceof Error ? error.message : String(error));
        throw error;
      }
    });
  }

  obtenerTrazas(): Span[] {
    return [...this.trazas];
  }

  imprimirArbol(span: Span = this.trazas[0], nivel = 0): void {
    if (!span) return;
    const indent = "  ".repeat(nivel);
    const estado = span.estado === "ok" ? "✅" : span.estado === "error" ? "❌" : "⏳";
    const duracion = span.duracionMs !== undefined ? `${span.duracionMs}ms` : "en curso";
    console.log(`   ${indent}${estado} ${span.nombre} (${duracion})`);
    if (span.atributos.tokensUsados) console.log(`   ${indent}   tokens: ${span.atributos.tokensUsados}`);
    if (span.error) console.log(`   ${indent}   error: ${span.error}`);
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
      completados[0] ?? { nombre: "ninguno", duracionMs: 0 } as Span,
    );

    return {
      totalSpans: todos.length,
      // Suma de spans: es trabajo instrumentado acumulado, no wall-clock de request.
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
      const docs = await this.tracer.trazar("rag.recuperar", { topK: 3 }, async () => {
        await new Promise((r) => setTimeout(r, 80));
        return ["doc1", "doc2", "doc3"];
      });

      const respuesta = await this.tracer.trazar("llm.completar", { modelo: DEFAULT_MODEL }, async (span) => {
        const r = await this.client.responses.create({
          model: DEFAULT_MODEL,
          reasoning: { effort: "low" },
          store: false,
          instructions: `Responde brevemente: ${consulta}`,
          input: "",
        });
        span.atributos.tokensUsados = Math.ceil(r.output_text.split(" ").length * 1.3);
        return r.output_text;
      });

      await this.tracer.trazar("parser.output", {}, async () => respuesta.trim());
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
  const respuesta = await agente.procesarConTrazas("¿Qué es el patrón Observer?");
  console.log(`\n   Respuesta: "${respuesta.slice(0, 100)}..."\n`);
  const tracer = agente.obtenerTracer();
  tracer.obtenerTrazas().forEach((t) => tracer.imprimirArbol(t));
  console.log(`\n   Métricas:`, tracer.obtenerMetricas());
  paso("✅", "Observability aislando correctamente trazas concurrentes");
}

async function main(): Promise<void> { await demostrarObservability(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
