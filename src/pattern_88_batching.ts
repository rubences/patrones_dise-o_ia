/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 88 — BATCHING (AGRUPACIÓN DE SOLICITUDES)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [solicitar(A)] ─┐
 *  [solicitar(B)] ─┼─▶ [Cola] ──ventana de tiempo / tamaño máximo──▶ [1 llamada
 *  [solicitar(C)] ─┘                                                  por lote]
 *       │                                                                 │
 *       ▼                                                                 ▼
 *  Cada llamador recibe SU resultado individual ◀── desmultiplexar ───────┘
 *
 *  Idea: cuando varias solicitudes independientes llegan en una
 *  ventana corta de tiempo (p.ej. clasificar 20 tickets de soporte
 *  casi simultáneos), agruparlas en UNA sola llamada al LLM reduce
 *  overhead de red y, en APIs que cobran por request, coste — sin que
 *  cada llamador sepa que fue agrupado.
 *
 *  Diferencia vs Patrón 48 (Semantic Cache): Semantic Cache evita
 *  llamadas REPETIDAS con contenido semánticamente similar. Batching
 *  agrupa llamadas DISTINTAS Y SIMULTÁNEAS en una sola petición —
 *  son complementarios, no alternativos.
 *
 *  Ventajas:
 *  - Menos llamadas HTTP → menos overhead y, en APIs por-request, menos coste
 *  - Transparente para el llamador (misma interfaz `solicitar(input)`)
 *  - Ventana de tiempo + tamaño máximo evitan tanto lotes gigantes
 *    como esperas indefinidas por un lote que nunca se llena
 *  - Cada solicitud resuelve con SU resultado, no con el lote completo
 */

import { isDirectRun, paso } from "./common.js";

interface SolicitudPendiente<TInput, TOutput> {
  input: TInput;
  resolve: (valor: TOutput) => void;
  reject: (error: unknown) => void;
}

export class BatchProcessor<TInput, TOutput> {
  private cola: SolicitudPendiente<TInput, TOutput>[] = [];
  private temporizador: ReturnType<typeof setTimeout> | null = null;
  private lotesEjecutados = 0;

  constructor(
    private procesarLote: (inputs: TInput[]) => Promise<TOutput[]>,
    private ventanaMs: number = 20,
    private maxLote: number = 10,
  ) {}

  solicitar(input: TInput): Promise<TOutput> {
    return new Promise((resolve, reject) => {
      this.cola.push({ input, resolve, reject });

      if (this.cola.length >= this.maxLote) {
        this.flush();
      } else if (!this.temporizador) {
        this.temporizador = setTimeout(() => this.flush(), this.ventanaMs);
      }
    });
  }

  private async flush(): Promise<void> {
    if (this.temporizador) {
      clearTimeout(this.temporizador);
      this.temporizador = null;
    }
    if (this.cola.length === 0) return;

    const lote = this.cola.splice(0, this.cola.length);
    this.lotesEjecutados++;
    console.log(`   📦 Lote #${this.lotesEjecutados}: agrupando ${lote.length} solicitudes en 1 llamada`);

    try {
      const resultados = await this.procesarLote(lote.map((s) => s.input));
      lote.forEach((solicitud, i) => solicitud.resolve(resultados[i]));
    } catch (error) {
      lote.forEach((solicitud) => solicitud.reject(error));
    }
  }

  obtenerLotesEjecutados(): number {
    return this.lotesEjecutados;
  }
}

// ── Simulación de una API que procesa un array de textos en 1 llamada ──
let llamadasApiReales = 0;
async function clasificarLoteSimulado(textos: string[]): Promise<string[]> {
  llamadasApiReales++;
  await new Promise((r) => setTimeout(r, 30)); // latencia de red simulada
  return textos.map((t) => (t.toLowerCase().includes("urgente") ? "alta_prioridad" : "normal"));
}

export async function demostrarBatching(): Promise<void> {
  paso("📦", "Demostrando Batching Pattern");
  llamadasApiReales = 0;

  const batcher = new BatchProcessor(clasificarLoteSimulado, 20, 10);

  paso("1️⃣", "5 solicitudes casi simultáneas → se agrupan en 1 sola llamada a la API");
  const tickets = [
    "El login no funciona, es urgente",
    "¿Cómo cambio mi contraseña?",
    "Servidor caído, urgente",
    "Pregunta sobre facturación",
    "No recibo emails de notificación",
  ];

  const resultados = await Promise.all(tickets.map((t) => batcher.solicitar(t)));
  tickets.forEach((t, i) => console.log(`   "${t.slice(0, 35)}..." → ${resultados[i]}`));

  console.log(`\n   Llamadas reales a la API: ${llamadasApiReales} (para ${tickets.length} solicitudes)`);

  paso("2️⃣", "Otra ráfaga que excede maxLote (10) → se corta en 2 lotes");
  llamadasApiReales = 0;
  const ráfaga = Array.from({ length: 15 }, (_, i) => `ticket ${i + 1}`);
  await Promise.all(ráfaga.map((t) => batcher.solicitar(t)));
  console.log(`   Llamadas reales a la API: ${llamadasApiReales} (para ${ráfaga.length} solicitudes, maxLote=10)`);

  paso("✅", "Batching reduciendo llamadas de red sin que el llamador lo perciba");
}

async function main(): Promise<void> {
  await demostrarBatching();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
