/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 80 — RATE LIMITING (LIMITACIÓN DE TASA)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Token Bucket por cliente]
 *  ├─ capacidad: 5 tokens
 *  ├─ tasa de recarga: 1 token / 2s
 *  └─ tokens actuales: se recargan según tiempo transcurrido, no un
 *     contador fijo por ventana
 *
 *  [Solicitud]
 *       │
 *       ▼
 *  ¿Hay ≥1 token? ──NO──▶ Rechazar (429) + tiempo de espera sugerido
 *       │
 *      SÍ
 *       │
 *       ▼
 *  Consumir 1 token → Permitir
 *
 *  Diferencia vs Patrón 21 (Proxy): el Proxy usa un contador fijo por
 *  usuario que solo se resetea manualmente. Este patrón implementa un
 *  algoritmo real de token bucket con recarga continua basada en
 *  tiempo transcurrido — el límite se respeta de forma exacta en
 *  cualquier ventana deslizante, no solo al reiniciar un contador.
 *
 *  Ventajas:
 *  - Permite ráfagas cortas hasta la capacidad del bucket
 *  - Tasa sostenida exacta a largo plazo (tokens/segundo)
 *  - No requiere temporizadores ni limpieza periódica (cálculo lazy)
 *  - Aislado por clave (usuario, API key, IP) sin memoria compartida
 */

import { isDirectRun, paso } from "./common.js";

export interface ConfigRateLimit {
  capacidad: number; // Máximo de tokens (tamaño de ráfaga permitida)
  tokensPorSegundo: number; // Tasa de recarga sostenida
}

export interface ResultadoRateLimit {
  permitido: boolean;
  tokensRestantes: number;
  esperaMs: number; // Si no permitido, ms hasta que haya 1 token disponible
}

class TokenBucket {
  private tokens: number;
  private ultimaRecarga: number;

  constructor(private config: ConfigRateLimit, ahora: number = Date.now()) {
    this.tokens = config.capacidad;
    this.ultimaRecarga = ahora;
  }

  private recargar(ahora: number): void {
    const segundosTranscurridos = Math.max(0, ahora - this.ultimaRecarga) / 1000;
    const tokensGenerados = segundosTranscurridos * this.config.tokensPorSegundo;
    this.tokens = Math.min(this.config.capacidad, this.tokens + tokensGenerados);
    this.ultimaRecarga = ahora;
  }

  consumir(ahora: number = Date.now()): ResultadoRateLimit {
    this.recargar(ahora);

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return { permitido: true, tokensRestantes: Math.floor(this.tokens), esperaMs: 0 };
    }

    const tokensFaltantes = 1 - this.tokens;
    const esperaMs = Math.ceil((tokensFaltantes / this.config.tokensPorSegundo) * 1000);
    return { permitido: false, tokensRestantes: 0, esperaMs };
  }
}

// Gestor con un bucket independiente por clave (usuario, API key, IP...)
export class RateLimiter {
  private buckets = new Map<string, TokenBucket>();

  constructor(private config: ConfigRateLimit) {}

  private bucketDe(clave: string): TokenBucket {
    let bucket = this.buckets.get(clave);
    if (!bucket) {
      bucket = new TokenBucket(this.config);
      this.buckets.set(clave, bucket);
    }
    return bucket;
  }

  consumir(clave: string): ResultadoRateLimit {
    return this.bucketDe(clave).consumir();
  }
}

export async function demostrarRateLimiting(): Promise<void> {
  paso("🚦", "Demostrando Rate Limiting Pattern (token bucket)");

  const limiter = new RateLimiter({ capacidad: 3, tokensPorSegundo: 1 });

  paso("1️⃣", "Ráfaga de 5 solicitudes contra un bucket de capacidad 3");
  for (let i = 1; i <= 5; i++) {
    const r = limiter.consumir("cliente-alice");
    const icono = r.permitido ? "✅" : "🚫";
    console.log(
      `   ${icono} Solicitud ${i}: ${r.permitido ? "permitida" : `rechazada, reintentar en ${r.esperaMs}ms`} (tokens restantes: ${r.tokensRestantes})`,
    );
  }

  paso("2️⃣", "Otro cliente tiene su propio bucket, sin verse afectado");
  const rBob = limiter.consumir("cliente-bob");
  console.log(`   ${rBob.permitido ? "✅" : "🚫"} cliente-bob: ${rBob.permitido ? "permitida" : "rechazada"} (tokens restantes: ${rBob.tokensRestantes})`);

  paso("✅", "Rate Limiting protegiendo la capacidad por cliente con recarga continua");
}

async function main(): Promise<void> {
  await demostrarRateLimiting();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
