/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 96 — CLARIFICATION LOOP
 * ═══════════════════════════════════════════════════════════════════
 */

import { isDirectRun, paso } from "./common.js";

export interface DeteccionAmbiguedad {
  ambigua: boolean;
  preguntaAclaracion?: string;
  motivo?: string;
}

export type FuncionDetectarAmbiguedad = (input: string) => Promise<DeteccionAmbiguedad>;
export type FuncionResponderAclaracion = (pregunta: string, ronda: number) => Promise<string>;

export interface ResultadoClarificacion {
  estado: "resolved" | "unresolved";
  intencionOriginal: string;
  interpretacionFinal?: string;
  rondas: number;
  historial: { pregunta: string; respuesta: string }[];
  motivoPendiente?: string;
}

export class ClarificationLoop {
  constructor(
    private detectarAmbiguedad: FuncionDetectarAmbiguedad,
    private maxRondas: number = 3,
  ) {}

  async clarificar(inputInicial: string, responder: FuncionResponderAclaracion): Promise<ResultadoClarificacion> {
    const intencionOriginal = inputInicial;
    let contextoActual = inputInicial;
    const historial: { pregunta: string; respuesta: string }[] = [];

    for (let ronda = 0; ronda <= this.maxRondas; ronda++) {
      const deteccion = await this.detectarAmbiguedad(contextoActual);
      if (!deteccion.ambigua) {
        return {
          estado: "resolved",
          intencionOriginal,
          interpretacionFinal: contextoActual,
          rondas: historial.length,
          historial,
        };
      }

      if (ronda === this.maxRondas || !deteccion.preguntaAclaracion) {
        return {
          estado: "unresolved",
          intencionOriginal,
          rondas: historial.length,
          historial,
          motivoPendiente: deteccion.motivo ?? "ambigüedad no resuelta",
        };
      }

      const respuesta = await responder(deteccion.preguntaAclaracion, ronda + 1);
      historial.push({ pregunta: deteccion.preguntaAclaracion, respuesta });
      // Preservamos siempre la intención original y acumulamos las aclaraciones.
      contextoActual = [
        intencionOriginal,
        ...historial.map((h, i) => `ACLARACIÓN ${i + 1}: ${h.respuesta}`),
      ].join("\n");
    }

    return {
      estado: "unresolved",
      intencionOriginal,
      rondas: historial.length,
      historial,
      motivoPendiente: "límite de aclaraciones agotado",
    };
  }
}

export async function demostrarClarificationLoop(): Promise<void> {
  paso("❓", "Demostrando Clarification Loop Pattern");

  const detectar: FuncionDetectarAmbiguedad = async (input) => {
    if (input.toLowerCase().includes("cancelar") && !/pedido\s+#?\d+/i.test(input) && !/ACLARACIÓN \d+:.*#?\d+/i.test(input)) {
      return {
        ambigua: true,
        motivo: "hay varios pedidos activos",
        preguntaAclaracion: "¿Qué número de pedido quieres cancelar?",
      };
    }
    return { ambigua: false };
  };

  const loop = new ClarificationLoop(detectar, 2);
  const resultado = await loop.clarificar(
    "Quiero cancelar mi pedido",
    async () => "El pedido #4821",
  );

  console.log(`   Estado: ${resultado.estado}`);
  console.log(`   Rondas: ${resultado.rondas}`);
  console.log(`   Interpretación: ${resultado.interpretacionFinal}`);
  paso("✅", "Clarification Loop distingue resolved de unresolved");
}

async function main(): Promise<void> { await demostrarClarificationLoop(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
