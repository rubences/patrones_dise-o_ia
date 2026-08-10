/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 38 — MIXTURE OF EXPERTS (MOE)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Entrada]
 *       │
 *       ▼
 *  [Router / Gating Network]
 *  └─ Decide qué expertos activar (top-k)
 *
 *       │
 *   ┌───┼───┬───┐
 *   ▼   ▼   ▼   ▼
 *  [E1][E2][E3][E4]  ← Expertos especializados (sólo top-k activos)
 *   │       │
 *   ▼       ▼
 *  [Agregador]
 *  └─ Combina salidas ponderadas
 *
 *       │
 *       ▼
 *  [Salida unificada]
 *
 *  Idea: Enrutar cada entrada a un subconjunto de expertos
 *  especializados, combinando sus salidas ponderadas.
 *
 *  Ventajas:
 *  - Escalabilidad masiva (sólo activa k expertos de N)
 *  - Especialización profunda por dominio
 *  - Eficiencia computacional
 *  - Mejor que un solo modelo generalista
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface Experto {
  nombre: string;
  dominio: string;
  descripcion: string;
  peso: number; // Influencia en la respuesta final 0-1
}

export interface ActivacionExperto {
  experto: Experto;
  score: number;
  respuesta?: string;
}

export class MixtureOfExperts {
  private expertos: Experto[];
  private client: OpenAI;
  private topK: number;

  constructor(client: OpenAI = makeClient(), topK = 2) {
    this.client = client;
    this.topK = topK;

    this.expertos = [
      { nombre: "Experto-Codigo", dominio: "software", descripcion: "Especialista en código, algoritmos y arquitectura", peso: 1.0 },
      { nombre: "Experto-Datos", dominio: "datos", descripcion: "Especialista en ML, estadística y análisis de datos", peso: 1.0 },
      { nombre: "Experto-Negocio", dominio: "negocio", descripcion: "Especialista en estrategia, ROI y casos de uso", peso: 1.0 },
      { nombre: "Experto-Seguridad", dominio: "seguridad", descripcion: "Especialista en ciberseguridad y privacidad", peso: 1.0 },
      { nombre: "Experto-UX", dominio: "diseño", descripcion: "Especialista en experiencia de usuario y diseño", peso: 1.0 },
    ];
  }

  private async enrutar(entrada: string): Promise<ActivacionExperto[]> {
    console.log(`   🗺️  Router MoE activando top-${this.topK} expertos...`);

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Dada esta pregunta: "${entrada}"
      
Asigna un score de 0-100 a cada experto según su relevancia:
${this.expertos.map((e) => `- ${e.nombre} (${e.dominio}): ${e.descripcion}`).join("\n")}

Responde en formato:
Experto-Codigo: [score]
Experto-Datos: [score]
Experto-Negocio: [score]
Experto-Seguridad: [score]
Experto-UX: [score]`,
      input: "",
    });

    // Parsear scores
    const activaciones: ActivacionExperto[] = this.expertos.map((e) => {
      const match = resp.output_text.match(new RegExp(`${e.nombre}:\\s*(\\d+)`));
      return { experto: e, score: match ? parseInt(match[1]) : 50 };
    });

    // Seleccionar top-K
    return activaciones.sort((a, b) => b.score - a.score).slice(0, this.topK);
  }

  async procesar(entrada: string): Promise<{ respuesta: string; expertosActivados: string[] }> {
    console.log(`\n   🎯 MoE procesando: "${entrada.slice(0, 50)}..."`);

    // 1. Routing
    const activaciones = await this.enrutar(entrada);
    const nombresActivados = activaciones.map((a) => `${a.experto.nombre}(${a.score})`);
    console.log(`   ✓ Expertos activados: ${nombresActivados.join(", ")}`);

    // 2. Cada experto responde en paralelo
    const promesas = activaciones.map(async (act) => {
      const resp = await this.client.responses.create({
        model: DEFAULT_MODEL,
        reasoning: { effort: "low" },
        store: false,
        instructions: `Eres el ${act.experto.nombre}. ${act.experto.descripcion}.
Responde desde tu especialidad (2-3 oraciones): ${entrada}`,
        input: "",
      });
      act.respuesta = resp.output_text;
      console.log(`   ✓ ${act.experto.nombre} respondió`);
      return act;
    });

    const respondidos = await Promise.all(promesas);

    // 3. Agregación ponderada
    const contextoAgregado = respondidos
      .map((a) => `[${a.experto.nombre} - relevancia ${a.score}%]\n${a.respuesta}`)
      .join("\n\n");

    const respFinal = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Combina estas respuestas especializadas en una sola respuesta coherente y completa:

${contextoAgregado}

Pregunta original: ${entrada}`,
      input: "",
    });

    return {
      respuesta: respFinal.output_text,
      expertosActivados: activaciones.map((a) => a.experto.nombre),
    };
  }
}

export async function demostrarMixtureOfExperts(client: OpenAI = makeClient()): Promise<void> {
  paso("🧪", "Demostrando Mixture of Experts Pattern");

  const moe = new MixtureOfExperts(client, 2);

  paso("1️⃣", "Pregunta técnica (activa expertos relevantes)");
  const r1 = await moe.procesar("¿Cómo implementar un pipeline de ML seguro y escalable?");
  console.log(`\n   Expertos activados: ${r1.expertosActivados.join(", ")}`);
  console.log(`   Respuesta: "${r1.respuesta.slice(0, 200)}..."\n`);

  paso("2️⃣", "Pregunta de negocio");
  const r2 = await moe.procesar("¿Cuál es el ROI de implementar IA en atención al cliente?");
  console.log(`\n   Expertos activados: ${r2.expertosActivados.join(", ")}`);
  console.log(`   Respuesta: "${r2.respuesta.slice(0, 200)}..."\n`);

  paso("✅", "MoE activando sólo los expertos más relevantes eficientemente");
}

async function main(): Promise<void> {
  await demostrarMixtureOfExperts();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => { console.error(e); process.exitCode = 1; });
}
