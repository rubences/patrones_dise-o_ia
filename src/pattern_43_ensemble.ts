/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 43 — ENSEMBLE (COMBINACIÓN DE MODELOS)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Entrada]
 *       │
 *   ┌───┼───┐
 *   ▼   ▼   ▼
 *  [M1][M2][M3]   ← Modelos/estrategias independientes
 *   │   │   │
 *   └───┴───┘
 *       │
 *       ▼
 *  [Agregador]
 *  ├─ Votación por mayoría
 *  ├─ Promedio ponderado
 *  └─ Meta-learner
 *       │
 *       ▼
 *  [Respuesta final (más robusta)]
 *
 *  Idea: Combinar múltiples modelos o estrategias independientes
 *  para reducir varianza y mejorar robustez.
 *
 *  Diferencia vs Self-Consistency: Ensemble usa DISTINTOS modelos/
 *  estrategias; Self-Consistency repite el MISMO modelo.
 *
 *  Ventajas:
 *  - Reduce varianza individual
 *  - Cubre distintas fortalezas de cada modelo
 *  - Más robusto ante fallos individuales
 *  - Detectable: alta divergencia = pregunta ambigua
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface ConfiguracionModelo {
  nombre: string;
  esfuerzo: "low" | "medium" | "high";
  instruccionBase: string;
  peso: number;
}

export interface ResultadoEnsemble {
  respuestaFinal: string;
  respuestasIndividuales: { modelo: string; respuesta: string }[];
  acuerdo: number; // 0-100%
  metodo: string;
}

export class EnsembleAgentes {
  private client: OpenAI;
  private modelos: ConfiguracionModelo[];

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
    this.modelos = [
      {
        nombre: "Analítico",
        esfuerzo: "medium",
        instruccionBase: "Responde de forma analítica y estructurada.",
        peso: 1.0,
      },
      {
        nombre: "Directo",
        esfuerzo: "low",
        instruccionBase: "Responde de forma directa y concisa.",
        peso: 0.8,
      },
      {
        nombre: "Reflexivo",
        esfuerzo: "high",
        instruccionBase: "Reflexiona en profundidad antes de responder.",
        peso: 1.2,
      },
    ];
  }

  async procesarConVotacion(pregunta: string): Promise<ResultadoEnsemble> {
    console.log(`\n   🎭 Ensemble (votación): "${pregunta.slice(0, 50)}..."`);

    const respuestas = await this.ejecutarTodos(pregunta);

    // Agregar: meta-modelo sintetiza las respuestas
    const contexto = respuestas
      .map((r) => `[${r.modelo}]: ${r.respuesta}`)
      .join("\n\n");

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Sintetiza estas ${respuestas.length} perspectivas en una respuesta final equilibrada:

${contexto}

Pregunta original: ${pregunta}
Proporciona la respuesta más completa integrando las perspectivas anteriores.`,
      input: "",
    });

    const acuerdo = this.calcularAcuerdo(respuestas.map((r) => r.respuesta));

    return {
      respuestaFinal: resp.output_text,
      respuestasIndividuales: respuestas,
      acuerdo,
      metodo: "votación-síntesis",
    };
  }

  async procesarConPonderacion(pregunta: string): Promise<ResultadoEnsemble> {
    console.log(`\n   ⚖️  Ensemble (ponderado): "${pregunta.slice(0, 50)}..."`);

    const respuestas = await this.ejecutarTodos(pregunta);

    // Ponderar por peso del modelo
    const pesoTotal = this.modelos.reduce((s, m) => s + m.peso, 0);
    const fragmentos = respuestas.map((r, i) => {
      const peso = this.modelos[i].peso / pesoTotal;
      return `[Peso ${(peso * 100).toFixed(0)}%] ${r.respuesta}`;
    });

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Genera una respuesta ponderando estas fuentes según sus pesos indicados:

${fragmentos.join("\n\n")}

Pregunta: ${pregunta}`,
      input: "",
    });

    return {
      respuestaFinal: resp.output_text,
      respuestasIndividuales: respuestas,
      acuerdo: this.calcularAcuerdo(respuestas.map((r) => r.respuesta)),
      metodo: "ponderación-por-peso",
    };
  }

  private async ejecutarTodos(pregunta: string) {
    const promesas = this.modelos.map(async (m) => {
      const resp = await this.client.responses.create({
        model: DEFAULT_MODEL,
        reasoning: { effort: m.esfuerzo },
        store: false,
        instructions: `${m.instruccionBase}\n\nPregunta: ${pregunta}`,
        input: "",
      });
      console.log(`   ✓ ${m.nombre} respondió`);
      return { modelo: m.nombre, respuesta: resp.output_text };
    });

    return Promise.all(promesas);
  }

  private calcularAcuerdo(respuestas: string[]): number {
    // Heurística simple: % de palabras clave compartidas
    const conjuntos = respuestas.map((r) =>
      new Set(r.toLowerCase().split(/\s+/).filter((w) => w.length > 4)),
    );
    if (conjuntos.length < 2) return 100;
    const interseccion = [...conjuntos[0]].filter((w) =>
      conjuntos.slice(1).every((s) => s.has(w)),
    );
    const union = new Set(conjuntos.flatMap((s) => [...s]));
    return Math.round((interseccion.length / union.size) * 100);
  }
}

export async function demostrarEnsemble(client: OpenAI = makeClient()): Promise<void> {
  paso("🎭", "Demostrando Ensemble Pattern");

  const ensemble = new EnsembleAgentes(client);

  paso("1️⃣", "Ensemble con síntesis por votación");
  const r1 = await ensemble.procesarConVotacion(
    "¿Cuáles son las mejores prácticas para desplegar LLMs en producción?",
  );
  console.log(`\n   Acuerdo entre modelos: ${r1.acuerdo}%`);
  console.log(`   Respuesta: "${r1.respuestaFinal.slice(0, 150)}..."\n`);

  paso("2️⃣", "Ensemble con ponderación por calidad");
  const r2 = await ensemble.procesarConPonderacion(
    "¿Qué patrón elegirías para un sistema de agentes con miles de usuarios?",
  );
  console.log(`\n   Método: ${r2.metodo}`);
  console.log(`   Respuesta: "${r2.respuestaFinal.slice(0, 150)}..."\n`);

  paso("✅", "Ensemble combinando múltiples estrategias para respuestas más robustas");
}

async function main(): Promise<void> {
  await demostrarEnsemble();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => { console.error(e); process.exitCode = 1; });
}
