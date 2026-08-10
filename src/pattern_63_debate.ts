/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 63 — DEBATE (AGENTES EN DEBATE ADVERSARIAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Cuestión]
 *       │
 *       ▼
 *  [Agente PRO]          [Agente CONTRA]
 *  Argumenta a favor  ←→  Argumenta en contra
 *       │                      │
 *       └──────────┬───────────┘
 *                  │
 *                  ▼
 *            [Juez / Árbitro]
 *            Evalúa argumentos
 *            → Veredicto fundamentado
 *
 *  Idea: Dos agentes debaten posiciones opuestas y un juez
 *  evalúa los argumentos para llegar a una conclusión objetiva.
 *
 *  Ventajas:
 *  - Explora múltiples perspectivas
 *  - Identificar contraargumentos antes de decidir
 *  - Reducir sesgos de confirmación
 *  - Decisiones más robustas y fundamentadas
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface Argumento {
  agente: string;
  posicion: "favor" | "contra";
  argumento: string;
  ronda: number;
}

export interface ResultadoDebate {
  cuestion: string;
  argumentos: Argumento[];
  veredicto: string;
  ganador: "favor" | "contra" | "empate";
  confianza: number;
}

export class SistemaDebate {
  private client: OpenAI;
  private rondas: number;

  constructor(client: OpenAI = makeClient(), rondas = 2) {
    this.client = client;
    this.rondas = rondas;
  }

  private async argumentar(
    cuestion: string,
    posicion: "favor" | "contra",
    historial: Argumento[],
    ronda: number,
  ): Promise<string> {
    const posicionStr = posicion === "favor" ? "A FAVOR" : "EN CONTRA";
    const args = historial.map((a) => `[${a.agente} - Ronda ${a.ronda}]: ${a.argumento}`).join("\n");

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Eres un debatiente que argumenta ${posicionStr} de: "${cuestion}"

Historial del debate:
${args || "(Inicio del debate)"}

Presenta tu argumento para la Ronda ${ronda} en 2-3 oraciones. Sé específico y refuta los puntos contrarios si los hay.`,
      input: "",
    });

    return resp.output_text;
  }

  private async juzgar(cuestion: string, argumentos: Argumento[]): Promise<{ veredicto: string; ganador: "favor" | "contra" | "empate"; confianza: number }> {
    const resumen = argumentos
      .map((a) => `[${a.agente} - ${a.posicion.toUpperCase()} - R${a.ronda}]: ${a.argumento}`)
      .join("\n\n");

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions: `Como árbitro imparcial, evalúa este debate sobre: "${cuestion}"

ARGUMENTOS:
${resumen}

Proporciona:
VEREDICTO: [análisis objetivo de 3-4 oraciones]
GANADOR: [FAVOR / CONTRA / EMPATE]
CONFIANZA: [0-100]`,
      input: "",
    });

    const ganador = resp.output_text.toUpperCase().includes("GANADOR: FAVOR") ? "favor"
      : resp.output_text.toUpperCase().includes("GANADOR: CONTRA") ? "contra"
      : "empate";
    const confianza = parseInt(resp.output_text.match(/CONFIANZA:\s*(\d+)/)?.[1] ?? "70");
    const veredicto = resp.output_text.match(/VEREDICTO:\s*([\s\S]+?)(?=GANADOR:|$)/)?.[1]?.trim() ?? resp.output_text;

    return { veredicto, ganador, confianza };
  }

  async debatir(cuestion: string): Promise<ResultadoDebate> {
    console.log(`\n   ⚔️  Debate: "${cuestion.slice(0, 60)}..."`);
    const argumentos: Argumento[] = [];

    for (let ronda = 1; ronda <= this.rondas; ronda++) {
      console.log(`   ── Ronda ${ronda} ──`);

      const argFavor = await this.argumentar(cuestion, "favor", argumentos, ronda);
      argumentos.push({ agente: "Agente-PRO", posicion: "favor", argumento: argFavor, ronda });
      console.log(`   ✅ PRO: "${argFavor.slice(0, 70)}..."`);

      const argContra = await this.argumentar(cuestion, "contra", argumentos, ronda);
      argumentos.push({ agente: "Agente-CONTRA", posicion: "contra", argumento: argContra, ronda });
      console.log(`   ❌ CONTRA: "${argContra.slice(0, 70)}..."`);
    }

    console.log(`\n   🏛️  Juez evaluando ${argumentos.length} argumentos...`);
    const { veredicto, ganador, confianza } = await this.juzgar(cuestion, argumentos);

    return { cuestion, argumentos, veredicto, ganador, confianza };
  }
}

export async function demostrarDebate(client: OpenAI = makeClient()): Promise<void> {
  paso("⚔️", "Demostrando Debate Pattern");

  const debate = new SistemaDebate(client, 2);

  paso("1️⃣", "Debate: RAG vs Fine-tuning");
  const resultado = await debate.debatir(
    "¿Es mejor usar RAG o Fine-tuning para adaptar LLMs a dominios específicos?",
  );

  console.log(`\n   Ganador: ${resultado.ganador.toUpperCase()} (confianza: ${resultado.confianza}%)`);
  console.log(`   Veredicto: "${resultado.veredicto.slice(0, 250)}..."\n`);

  paso("✅", "Debate explorando perspectivas opuestas para decisiones fundamentadas");
}

async function main(): Promise<void> { await demostrarDebate(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
