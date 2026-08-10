/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 86 — CONTEXT COMPACTION (COMPACTACIÓN DE CONTEXTO)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Historial de conversación de N turnos]
 *       │
 *       ▼
 *  ¿Turnos antiguos > umbral? ──NO──▶ Enviar historial completo
 *       │
 *      SÍ
 *       ▼
 *  [Turnos antiguos] ──resumir──▶ [Resumen compacto]
 *  [Turnos recientes] ──────────▶ [Verbatim, sin tocar]
 *       │
 *       ▼
 *  [Resumen + turnos recientes] → nuevo contexto, tamaño acotado
 *
 *  Idea: una conversación larga con un agente eventualmente excede la
 *  ventana de contexto. Truncar simplemente pierde información
 *  potencialmente relevante de turnos antiguos. Compactar resume esos
 *  turnos antiguos en un digest conciso, preservando los turnos
 *  recientes verbatim (donde la fidelidad exacta importa más).
 *
 *  Diferencia vs Patrón 51 (Long-Term Memory): Long-Term Memory
 *  persiste hechos/preferencias ENTRE sesiones distintas. Este patrón
 *  opera DENTRO de una única sesión larga, comprimiendo su propio
 *  historial para seguir cabiendo en la ventana de contexto.
 *
 *  Diferencia vs Patrón 49/66 (Prompt/Contextual Compression): esos
 *  patrones comprimen UN prompt o UN conjunto de documentos
 *  recuperados. Este patrón comprime específicamente el HISTORIAL DE
 *  TURNOS de una conversación multi-turno, de forma incremental
 *  (turnos ya resumidos no se vuelven a resumir).
 *
 *  Ventajas:
 *  - La conversación nunca excede la ventana de contexto
 *  - Turnos recientes conservan fidelidad exacta
 *  - El resumen es incremental: solo se resume lo nuevo desde el último corte
 *  - Reduce coste de tokens en conversaciones largas sin perder contexto clave
 */

import { isDirectRun, paso } from "./common.js";

export interface Turno {
  rol: "user" | "assistant";
  contenido: string;
}

export interface ResultadoCompactacion {
  resumenAntiguos: string | null;
  turnosRecientes: Turno[];
  turnosResumidos: number;
  tokensEstimados: number;
}

export type FuncionResumen = (turnos: Turno[], resumenPrevio: string | null) => Promise<string>;

// Resumen extractivo simple para la demo — en producción se pasaría un
// resumidor real basado en LLM (ver la nota en `demostrarContextCompaction`).
const resumenExtractivoSimple: FuncionResumen = async (turnos, resumenPrevio) => {
  const puntos = turnos.map((t) => `${t.rol === "user" ? "Usuario" : "Agente"}: ${t.contenido.slice(0, 40)}`);
  const base = resumenPrevio ? `${resumenPrevio}` : "";
  return `${base}${base ? " | " : ""}Resumen de ${turnos.length} turnos: ${puntos.join("; ")}`;
};

function estimarTokens(texto: string): number {
  return Math.ceil(texto.length / 4); // heurística simple: ~4 caracteres por token
}

export class CompactadorContexto {
  private resumenAntiguos: string | null = null;
  private turnosResumidosHasta = 0;

  constructor(
    private maxTurnosRecientes: number,
    private resumir: FuncionResumen = resumenExtractivoSimple,
  ) {}

  async compactar(historial: Turno[]): Promise<ResultadoCompactacion> {
    if (historial.length <= this.maxTurnosRecientes) {
      return {
        resumenAntiguos: this.resumenAntiguos,
        turnosRecientes: historial,
        turnosResumidos: 0,
        tokensEstimados: estimarTokens(historial.map((t) => t.contenido).join(" ")),
      };
    }

    const corte = historial.length - this.maxTurnosRecientes;
    const turnosNuevosParaResumir = historial.slice(this.turnosResumidosHasta, corte);

    if (turnosNuevosParaResumir.length > 0) {
      console.log(`   📝 Resumiendo ${turnosNuevosParaResumir.length} turnos nuevos (incremental, no re-resume lo ya resumido)`);
      this.resumenAntiguos = await this.resumir(turnosNuevosParaResumir, this.resumenAntiguos);
      this.turnosResumidosHasta = corte;
    }

    const turnosRecientes = historial.slice(corte);
    const contextoResultante = (this.resumenAntiguos ?? "") + turnosRecientes.map((t) => t.contenido).join(" ");

    return {
      resumenAntiguos: this.resumenAntiguos,
      turnosRecientes,
      turnosResumidos: this.turnosResumidosHasta,
      tokensEstimados: estimarTokens(contextoResultante),
    };
  }
}

export async function demostrarContextCompaction(): Promise<void> {
  paso("🗜️", "Demostrando Context Compaction Pattern");
  console.log(
    "   Nota: el resumidor de esta demo es extractivo simple (sin LLM). En producción\n" +
      "   se inyectaría una función que llame a openai.responses.create() para resumir de verdad.",
  );

  const historial: Turno[] = [];
  for (let i = 1; i <= 3; i++) {
    historial.push({ rol: "user", contenido: `Pregunta ${i} sobre el patrón Circuit Breaker` });
    historial.push({ rol: "assistant", contenido: `Respuesta ${i} explicando el estado abierto/cerrado` });
  }

  const compactador = new CompactadorContexto(4); // conservar los últimos 4 turnos verbatim

  paso("1️⃣", "Conversación corta (6 turnos, umbral 4) → se compacta");
  const r1 = await compactador.compactar(historial);
  console.log(`   Turnos resumidos: ${r1.turnosResumidos} | Turnos recientes verbatim: ${r1.turnosRecientes.length}`);
  console.log(`   Resumen: "${r1.resumenAntiguos?.slice(0, 100)}..."`);
  console.log(`   Tokens estimados del contexto resultante: ${r1.tokensEstimados}`);

  paso("2️⃣", "La conversación crece más → compactación incremental (no re-resume lo ya resumido)");
  historial.push({ rol: "user", contenido: "Pregunta 4 sobre el patrón Bulkhead" });
  historial.push({ rol: "assistant", contenido: "Respuesta 4 explicando el aislamiento de recursos" });
  const r2 = await compactador.compactar(historial);
  console.log(`   Turnos resumidos acumulados: ${r2.turnosResumidos} | Turnos recientes verbatim: ${r2.turnosRecientes.length}`);

  paso("✅", "Context Compaction manteniendo la conversación dentro de la ventana de contexto");
}

async function main(): Promise<void> {
  await demostrarContextCompaction();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
