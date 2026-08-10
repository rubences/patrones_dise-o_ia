/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 96 — CLARIFICATION LOOP (BUCLE DE CLARIFICACIÓN)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Solicitud del usuario]
 *       │
 *       ▼
 *  ¿Es ambigua? (¿hay ≥2 interpretaciones razonables con info insuficiente?)
 *       │
 *      SÍ ──▶ [Pregunta de clarificación específica] ──▶ espera respuesta ──┐
 *       │                                                                    │
 *      NO                                                                   │
 *       │                                                                   │
 *       ▼                                                                   │
 *  [Proceder con la tarea] ◀──────────────────────────────────────────────┘
 *
 *  Idea: cuando la entrada admite varias interpretaciones válidas con
 *  la información disponible, preguntar es mejor que adivinar — sobre
 *  todo si la acción tiene consecuencias (cancelar un pedido, borrar
 *  un archivo). Adivinar mal cuesta más que una pregunta.
 *
 *  Diferencia vs Patrón 6 (Planning): Planning descompone una tarea ya
 *  bien entendida en subtareas. Clarification Loop actúa ANTES —
 *  cuando la tarea en sí no está bien definida todavía.
 *
 *  Diferencia vs Patrón 8 (Human-in-Loop): Human-in-Loop pide
 *  aprobación de una acción de riesgo ya decidida. Clarification Loop
 *  pregunta sobre la INTENCIÓN del usuario cuando aún no está clara —
 *  no es una aprobación, es resolver ambigüedad antes de actuar.
 *
 *  Ventajas:
 *  - Evita ejecutar la interpretación equivocada de una solicitud ambigua
 *  - La pregunta es específica (ofrece las opciones detectadas), no genérica
 *  - Límite de rondas de clarificación evita bucles infinitos
 *  - Solicitudes claras no se demoran con preguntas innecesarias
 */

import { isDirectRun, paso } from "./common.js";

export interface AnalisisAmbiguedad {
  esAmbiguo: boolean;
  interpretaciones?: string[];
  preguntaClarificadora?: string;
}

export type FuncionDetectarAmbiguedad = (input: string, contexto: Record<string, unknown>) => Promise<AnalisisAmbiguedad>;

export interface ResultadoClarificacion {
  procedioDirecto: boolean;
  rondasDeClarificacion: number;
  interpretacionFinal: string;
}

export class GestorClarificacion {
  constructor(private detectarAmbiguedad: FuncionDetectarAmbiguedad) {}

  async procesar(
    inputInicial: string,
    contexto: Record<string, unknown>,
    responderClarificacion: (pregunta: string) => Promise<string>,
    maxRondas: number = 2,
  ): Promise<ResultadoClarificacion> {
    let inputActual = inputInicial;
    let rondas = 0;

    for (; rondas < maxRondas; rondas++) {
      const analisis = await this.detectarAmbiguedad(inputActual, contexto);
      if (!analisis.esAmbiguo) {
        return { procedioDirecto: rondas === 0, rondasDeClarificacion: rondas, interpretacionFinal: inputActual };
      }

      console.log(`   ❓ Ambiguo (${analisis.interpretaciones?.length} interpretaciones): "${analisis.preguntaClarificadora}"`);
      const respuesta = await responderClarificacion(analisis.preguntaClarificadora ?? "");
      console.log(`   💬 Usuario aclara: "${respuesta}"`);
      inputActual = respuesta;
    }

    return { procedioDirecto: false, rondasDeClarificacion: rondas, interpretacionFinal: inputActual };
  }
}

// ── Detector simulado: en producción sería una llamada al LLM preguntando
// "¿esta solicitud es ambigua dado este contexto? si sí, qué interpretaciones caben" ──
function detectorSimulado(): FuncionDetectarAmbiguedad {
  return async (input: string, contexto: Record<string, unknown>) => {
    const pedidos = (contexto.pedidosActivos as string[]) ?? [];
    if (/cancela(r)? mi pedido/i.test(input) && pedidos.length > 1) {
      return {
        esAmbiguo: true,
        interpretaciones: pedidos,
        preguntaClarificadora: `Tienes ${pedidos.length} pedidos activos (${pedidos.join(", ")}). ¿Cuál quieres cancelar?`,
      };
    }
    return { esAmbiguo: false };
  };
}

export async function demostrarClarificationLoop(): Promise<void> {
  paso("❓", "Demostrando Clarification Loop Pattern");

  const gestor = new GestorClarificacion(detectorSimulado());

  paso("1️⃣", "Solicitud ambigua: el usuario tiene 2 pedidos activos");
  const r1 = await gestor.procesar(
    "Cancela mi pedido",
    { pedidosActivos: ["#4521 (zapatillas)", "#4530 (mochila)"] },
    async () => "El #4530, la mochila",
  );
  console.log(`   Procedió directo: ${r1.procedioDirecto} | Rondas: ${r1.rondasDeClarificacion} | Interpretación final: "${r1.interpretacionFinal}"`);

  paso("2️⃣", "Solicitud clara: un solo pedido activo, no hace falta preguntar");
  const r2 = await gestor.procesar("Cancela mi pedido", { pedidosActivos: ["#4521 (zapatillas)"] }, async () => "");
  console.log(`   Procedió directo: ${r2.procedioDirecto} | Rondas: ${r2.rondasDeClarificacion}`);

  paso("✅", "Clarification Loop preguntando en vez de adivinar cuando hay ambigüedad real");
}

async function main(): Promise<void> {
  await demostrarClarificationLoop();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
