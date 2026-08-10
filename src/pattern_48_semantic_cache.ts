/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 48 — SEMANTIC CACHE (CACHÉ SEMÁNTICA)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Caché Exacta (tradicional):
 *  "¿Qué es IA?" ──hash──▶ MISS (pregunta diferente)
 *  "Que es la ia" ─hash──▶ MISS (aunque son iguales semánticamente)
 *
 *  Caché Semántica:
 *  "¿Qué es IA?"    ──embedding──▶ [0.2, 0.8, ...]
 *  "Que es la ia"   ──embedding──▶ [0.21, 0.79, ...] ← similitud 0.98
 *                                                       HIT ✓
 *
 *  Idea: Cachear respuestas por similitud semántica, no por igualdad
 *  exacta. Reduce llamadas a LLM hasta en un 40-60%.
 *
 *  Ventajas:
 *  - Reutiliza respuestas para preguntas similares
 *  - -40-60% de llamadas a LLM
 *  - Respuesta instantánea para hits
 *  - Invariante a reformulaciones
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface EntradaCache {
  consulta: string;
  respuesta: string;
  embedding: number[];
  timestamp: Date;
  hits: number;
}

export class CacheSemantica {
  private entradas: EntradaCache[] = [];
  private umbralSimilitud: number;
  private estadisticas = { total: 0, hits: 0, misses: 0 };

  constructor(umbralSimilitud = 0.85) {
    this.umbralSimilitud = umbralSimilitud;
  }

  // Embedding simplificado: vector de frecuencias de palabras clave
  private calcularEmbedding(texto: string): number[] {
    const palabras = texto.toLowerCase().replace(/[^a-záéíóúñü\s]/g, "").split(/\s+/);
    const vocabulario = ["ia", "agente", "modelo", "patron", "diseño", "llm", "datos", "sistema",
      "codigo", "funcion", "clase", "implementar", "usar", "como", "que", "cuando"];
    return vocabulario.map((v) => palabras.filter((p) => p.includes(v)).length / (palabras.length || 1));
  }

  private similitudCoseno(a: number[], b: number[]): number {
    const dot = a.reduce((s, ai, i) => s + ai * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, ai) => s + ai * ai, 0));
    const magB = Math.sqrt(b.reduce((s, bi) => s + bi * bi, 0));
    return magA && magB ? dot / (magA * magB) : 0;
  }

  buscar(consulta: string): EntradaCache | null {
    this.estadisticas.total++;
    const embConsulta = this.calcularEmbedding(consulta);

    let mejorMatch: EntradaCache | null = null;
    let mejorSimilitud = 0;

    for (const entrada of this.entradas) {
      const sim = this.similitudCoseno(embConsulta, entrada.embedding);
      if (sim > mejorSimilitud) {
        mejorSimilitud = sim;
        mejorMatch = entrada;
      }
    }

    if (mejorMatch && mejorSimilitud >= this.umbralSimilitud) {
      this.estadisticas.hits++;
      mejorMatch.hits++;
      console.log(`   ✅ HIT semántico (similitud: ${(mejorSimilitud * 100).toFixed(1)}%)`);
      return mejorMatch;
    }

    this.estadisticas.misses++;
    console.log(`   ❌ MISS (mejor similitud: ${(mejorSimilitud * 100).toFixed(1)}%)`);
    return null;
  }

  guardar(consulta: string, respuesta: string): void {
    this.entradas.push({
      consulta,
      respuesta,
      embedding: this.calcularEmbedding(consulta),
      timestamp: new Date(),
      hits: 0,
    });
  }

  obtenerEstadisticas() {
    return {
      ...this.estadisticas,
      hitRate: this.estadisticas.total > 0
        ? `${((this.estadisticas.hits / this.estadisticas.total) * 100).toFixed(1)}%`
        : "0%",
      entradas: this.entradas.length,
    };
  }
}

export class AgenteConCacheSemantica {
  private cache: CacheSemantica;
  private client: OpenAI;

  constructor(client: OpenAI = makeClient(), umbral = 0.75) {
    this.client = client;
    this.cache = new CacheSemantica(umbral);
  }

  async responder(consulta: string): Promise<{ respuesta: string; deCache: boolean }> {
    console.log(`\n   🔍 Consulta: "${consulta.slice(0, 60)}..."`);

    const hit = this.cache.buscar(consulta);
    if (hit) {
      return { respuesta: hit.respuesta, deCache: true };
    }

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: consulta,
      input: "",
    });

    this.cache.guardar(consulta, resp.output_text);
    return { respuesta: resp.output_text, deCache: false };
  }

  obtenerEstadisticas() {
    return this.cache.obtenerEstadisticas();
  }
}

export async function demostrarSemanticCache(client: OpenAI = makeClient()): Promise<void> {
  paso("🧠", "Demostrando Semantic Cache Pattern");

  const agente = new AgenteConCacheSemantica(client, 0.7);

  paso("1️⃣", "Primera consulta (MISS → llamada a LLM)");
  const r1 = await agente.responder("¿Qué es la inteligencia artificial?");
  console.log(`   De caché: ${r1.deCache} | Respuesta: "${r1.respuesta.slice(0, 80)}..."\n`);

  paso("2️⃣", "Consulta semánticamente similar (HIT → sin LLM)");
  const r2 = await agente.responder("Qué es la ia y cómo funciona");
  console.log(`   De caché: ${r2.deCache} | Respuesta: "${r2.respuesta.slice(0, 80)}..."\n`);

  const r3 = await agente.responder("Explícame que es la inteligencia artificial");
  console.log(`   De caché: ${r3.deCache} | Respuesta: "${r3.respuesta.slice(0, 80)}..."\n`);

  paso("3️⃣", "Nueva consulta diferente (MISS)");
  const r4 = await agente.responder("¿Cómo implementar un patrón Singleton en TypeScript?");
  console.log(`   De caché: ${r4.deCache}\n`);

  paso("4️⃣", "Estadísticas finales");
  const stats = agente.obtenerEstadisticas();
  console.log(`
   Total consultas: ${stats.total}
   Hits: ${stats.hits} | Misses: ${stats.misses}
   Hit Rate: ${stats.hitRate}
   Entradas en caché: ${stats.entradas}
  `);

  paso("✅", "Semantic Cache reduciendo llamadas a LLM con similitud semántica");
}

async function main(): Promise<void> {
  await demostrarSemanticCache();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => { console.error(e); process.exitCode = 1; });
}
