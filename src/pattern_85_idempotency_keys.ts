/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 85 — IDEMPOTENCY KEYS (CLAVES DE IDEMPOTENCIA)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Agente decide ejecutar una acción con efecto secundario]
 *       │
 *       ▼
 *  [Clave de idempotencia] (determinística, no un random por intento)
 *       │
 *       ▼
 *  ¿Ya se ejecutó esta clave? ──SÍ──▶ Devolver resultado guardado,
 *       │                              NO reejecutar
 *      NO
 *       ▼
 *  Ejecutar acción → Guardar resultado bajo la clave → Devolver
 *
 *  Idea: Retry-Backoff (Patrón 47) y Circuit Breaker (Patrón 45)
 *  reintentan LLAMADAS que fallaron — pero un timeout de red no
 *  significa que la acción no se ejecutó del lado del servidor
 *  (p.ej. el email SÍ se envió, el pago SÍ se procesó, solo la
 *  respuesta de confirmación se perdió). Reintentar sin una clave de
 *  idempotencia duplica el efecto secundario. Este patrón desacopla
 *  "reintentar la llamada" de "repetir el efecto".
 *
 *  Diferencia vs Patrón 44 (Checkpointing): Checkpointing guarda
 *  progreso de un flujo LARGO para reanudarlo tras un fallo. Este
 *  patrón es específico de UNA acción con efecto secundario externo
 *  (side effect) y garantiza que, sin importar cuántas veces se
 *  reintente la llamada, el efecto ocurre como máximo una vez.
 *
 *  Ventajas:
 *  - Seguro combinar con Retry-Backoff sin duplicar efectos
 *  - La clave debe derivarse del contenido de la acción, no del
 *    intento (mismo pedido → misma clave, aunque se reintente 5 veces)
 *  - Resultado cacheado permite responder rápido a reintentos legítimos
 *  - TTL opcional: evita crecimiento indefinido del registro
 */

import { isDirectRun, paso } from "./common.js";

export interface EntradaIdempotencia<T> {
  resultado: T;
  timestamp: number;
}

export class RegistroIdempotencia {
  private registro = new Map<string, EntradaIdempotencia<unknown>>();

  constructor(private ttlMs: number = 5 * 60 * 1000) {}

  private vigente(entrada: EntradaIdempotencia<unknown>, ahora: number): boolean {
    return ahora - entrada.timestamp < this.ttlMs;
  }

  async ejecutar<T>(claveIdempotencia: string, accion: () => Promise<T>): Promise<{ resultado: T; repetido: boolean }> {
    const ahora = Date.now();
    const existente = this.registro.get(claveIdempotencia);

    if (existente && this.vigente(existente, ahora)) {
      console.log(`   ♻️  Clave "${claveIdempotencia}" ya procesada — devolviendo resultado guardado, SIN reejecutar`);
      return { resultado: existente.resultado as T, repetido: true };
    }

    console.log(`   ▶️  Clave "${claveIdempotencia}" nueva — ejecutando acción`);
    const resultado = await accion();
    this.registro.set(claveIdempotencia, { resultado, timestamp: ahora });
    return { resultado, repetido: false };
  }

  tamaño(): number {
    return this.registro.size;
  }
}

// ── Simulación: envío de email con timeout ambiguo tras el cual se reintenta ──
let contadorEnviosReales = 0;
async function enviarEmailReal(destinatario: string): Promise<string> {
  contadorEnviosReales++;
  return `Email #${contadorEnviosReales} enviado a ${destinatario}`;
}

export async function demostrarIdempotencyKeys(): Promise<void> {
  paso("🔑", "Demostrando Idempotency Keys Pattern");
  contadorEnviosReales = 0;

  const registro = new RegistroIdempotencia();

  paso("1️⃣", "Sin clave de idempotencia: un retry tras timeout duplica el envío");
  await enviarEmailReal("cliente@example.com"); // intento original
  await enviarEmailReal("cliente@example.com"); // retry tras timeout ambiguo — ¡duplicado real!
  console.log(`   Envíos reales sin protección: ${contadorEnviosReales}`);

  contadorEnviosReales = 0;
  paso("2️⃣", "Con clave de idempotencia derivada del pedido (no del intento)");
  const clave = "email:cliente@example.com:factura-2026-08-001"; // determinística: mismo pedido → misma clave

  const r1 = await registro.ejecutar(clave, () => enviarEmailReal("cliente@example.com"));
  console.log(`   Intento original → ${r1.resultado} (repetido: ${r1.repetido})`);

  const r2 = await registro.ejecutar(clave, () => enviarEmailReal("cliente@example.com"));
  console.log(`   Retry tras timeout ambiguo → ${r2.resultado} (repetido: ${r2.repetido})`);

  console.log(`\n   Envíos reales con protección: ${contadorEnviosReales} (debería seguir siendo 1)`);

  paso("3️⃣", "Un pedido distinto usa una clave distinta → sí se ejecuta");
  const r3 = await registro.ejecutar("email:cliente@example.com:factura-2026-08-002", () =>
    enviarEmailReal("cliente@example.com"),
  );
  console.log(`   Nueva factura → ${r3.resultado} (repetido: ${r3.repetido})`);
  console.log(`   Envíos reales totales: ${contadorEnviosReales} | Claves registradas: ${registro.tamaño()}`);

  paso("✅", "Idempotency Keys garantizando efectos secundarios exactly-once ante reintentos");
}

async function main(): Promise<void> {
  await demostrarIdempotencyKeys();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
