/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 47 — RETRY WITH BACKOFF (REINTENTO CON ESPERA EXPONENCIAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Petición]
 *       │
 *  ──── Intento 1 ────▶ ✗ Fallo
 *       │
 *  espera 1s (backoff inicial)
 *       │
 *  ──── Intento 2 ────▶ ✗ Fallo
 *       │
 *  espera 2s (×2)
 *       │
 *  ──── Intento 3 ────▶ ✗ Fallo
 *       │
 *  espera 4s (×2)
 *       │
 *  ──── Intento 4 ────▶ ✓ Éxito
 *
 *  Idea: Reintentar operaciones fallidas con espera creciente,
 *  opcionalmente con jitter para evitar thundering herd.
 *
 *  Ventajas:
 *  - Recuperación automática de fallos transitorios
 *  - Evita sobrecarga del servicio (backoff + jitter)
 *  - Configurable por tipo de error
 *  - Transparente para el código cliente
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface ConfigRetry {
  maxIntentos: number;
  esperaInicialMs: number;
  factorBackoff: number;   // Multiplicador (2 = exponencial)
  maxEsperaMs: number;
  jitter: boolean;         // Añadir aleatoriedad para evitar thundering herd
  erroresReintentables: string[];
}

export class RetryWithBackoff {
  private config: ConfigRetry;

  constructor(config: Partial<ConfigRetry> = {}) {
    this.config = {
      maxIntentos: 3,
      esperaInicialMs: 200,
      factorBackoff: 2,
      maxEsperaMs: 5000,
      jitter: true,
      erroresReintentables: ["timeout", "rate_limit", "network", "503", "429"],
      ...config,
    };
  }

  async ejecutar<T>(operacion: () => Promise<T>, nombre = "operación"): Promise<T> {
    let ultimoError: Error | null = null;

    for (let intento = 1; intento <= this.config.maxIntentos; intento++) {
      try {
        console.log(`   🔄 [${nombre}] Intento ${intento}/${this.config.maxIntentos}`);
        const resultado = await operacion();
        if (intento > 1) console.log(`   ✅ Éxito en intento ${intento}`);
        return resultado;
      } catch (error) {
        ultimoError = error instanceof Error ? error : new Error(String(error));

        if (!this.esReintentable(ultimoError)) {
          console.log(`   ❌ Error no reintentable: ${ultimoError.message}`);
          throw ultimoError;
        }

        if (intento < this.config.maxIntentos) {
          const espera = this.calcularEspera(intento);
          console.log(`   ⏱️  Esperando ${espera}ms antes del intento ${intento + 1}...`);
          await new Promise((r) => setTimeout(r, espera));
        }
      }
    }

    throw new Error(`[${nombre}] Agotados ${this.config.maxIntentos} intentos. Último error: ${ultimoError?.message}`);
  }

  private calcularEspera(intento: number): number {
    const base = this.config.esperaInicialMs * Math.pow(this.config.factorBackoff, intento - 1);
    const capped = Math.min(base, this.config.maxEsperaMs);
    if (this.config.jitter) {
      return Math.round(capped * (0.5 + Math.random() * 0.5)); // 50-100% del tiempo base
    }
    return Math.round(capped);
  }

  private esReintentable(error: Error): boolean {
    return this.config.erroresReintentables.some((e) =>
      error.message.toLowerCase().includes(e),
    );
  }
}

// Decorador de función con retry integrado
export function conRetry<T>(
  fn: () => Promise<T>,
  config?: Partial<ConfigRetry>,
): () => Promise<T> {
  const retry = new RetryWithBackoff(config);
  return () => retry.ejecutar(fn, fn.name || "función");
}

export async function demostrarRetryWithBackoff(client: OpenAI = makeClient()): Promise<void> {
  paso("🔁", "Demostrando Retry with Backoff Pattern");

  const retry = new RetryWithBackoff({
    maxIntentos: 4,
    esperaInicialMs: 100, // reducido para demo
    factorBackoff: 2,
    jitter: true,
  });

  paso("1️⃣", "Operación que falla y luego tiene éxito");

  let contador = 0;
  const resultado1 = await retry.ejecutar(async () => {
    contador++;
    if (contador < 3) throw new Error("timeout: servicio no disponible");
    return "¡Operación exitosa!";
  }, "servicio-externo");

  console.log(`   Resultado: ${resultado1}\n`);

  paso("2️⃣", "Llamada LLM con retry automático");

  const resultado2 = await retry.ejecutar(async () => {
    const resp = await client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: "Explica el patrón Retry with Backoff en una oración.",
      input: "",
    });
    return resp.output_text;
  }, "llm-call");

  console.log(`   LLM: "${resultado2.slice(0, 120)}..."\n`);

  paso("3️⃣", "Error no reintentable (falla inmediatamente)");

  try {
    await retry.ejecutar(async () => {
      throw new Error("forbidden: acceso denegado");
    }, "api-privada");
  } catch (e: unknown) {
    console.log(`   Error esperado: ${(e as Error).message.slice(0, 80)}`);
  }

  paso("✅", "Retry with Backoff recuperando fallos transitorios automáticamente");
}

async function main(): Promise<void> {
  await demostrarRetryWithBackoff();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => { console.error(e); process.exitCode = 1; });
}
