/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 85 — IDEMPOTENCY KEYS (CLAVES DE IDEMPOTENCIA)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Reintentos secuenciales Y concurrentes con la misma clave deben
 *  converger en un único efecto. Las llamadas concurrentes se coalescen
 *  sobre la misma Promise en vuelo y reciben el mismo resultado.
 */

import { isDirectRun, paso } from "./common.js";

export interface EntradaIdempotencia<T> {
  resultado: T;
  timestamp: number;
}

export class RegistroIdempotencia {
  private registro = new Map<string, EntradaIdempotencia<unknown>>();
  private enCurso = new Map<string, Promise<unknown>>();

  constructor(private ttlMs: number = 5 * 60 * 1000) {}

  private vigente(entrada: EntradaIdempotencia<unknown>, ahora: number): boolean {
    return ahora - entrada.timestamp < this.ttlMs;
  }

  async ejecutar<T>(claveIdempotencia: string, accion: () => Promise<T>): Promise<{ resultado: T; repetido: boolean }> {
    const ahora = Date.now();
    const existente = this.registro.get(claveIdempotencia);

    if (existente && this.vigente(existente, ahora)) {
      console.log(`   ♻️  Clave "${claveIdempotencia}" ya procesada — devolviendo resultado guardado`);
      return { resultado: existente.resultado as T, repetido: true };
    }

    // Si existe una ejecución en vuelo con la misma clave, NO volvemos a
    // ejecutar el side effect: esperamos la misma Promise y reutilizamos su resultado.
    const pendiente = this.enCurso.get(claveIdempotencia);
    if (pendiente) {
      console.log(`   ⏳ Clave "${claveIdempotencia}" ya está en ejecución — coalesciendo request concurrente`);
      return { resultado: await pendiente as T, repetido: true };
    }

    console.log(`   ▶️  Clave "${claveIdempotencia}" nueva — ejecutando acción una sola vez`);
    const promesa = (async () => {
      const resultado = await accion();
      // El TTL empieza cuando el efecto concluye, no cuando comenzó la llamada.
      this.registro.set(claveIdempotencia, { resultado, timestamp: Date.now() });
      return resultado;
    })();

    this.enCurso.set(claveIdempotencia, promesa);

    try {
      return { resultado: await promesa, repetido: false };
    } finally {
      // Solo elimina si nadie sustituyó la Promise (defensivo ante cambios futuros).
      if (this.enCurso.get(claveIdempotencia) === promesa) {
        this.enCurso.delete(claveIdempotencia);
      }
    }
  }

  limpiarExpiradas(ahora: number = Date.now()): number {
    let eliminadas = 0;
    for (const [clave, entrada] of this.registro) {
      if (!this.vigente(entrada, ahora)) {
        this.registro.delete(clave);
        eliminadas++;
      }
    }
    return eliminadas;
  }

  tamaño(): number {
    return this.registro.size;
  }

  enVuelo(): number {
    return this.enCurso.size;
  }
}

let contadorEnviosReales = 0;
async function enviarEmailReal(destinatario: string): Promise<string> {
  contadorEnviosReales++;
  await new Promise((r) => setTimeout(r, 20));
  return `Email #${contadorEnviosReales} enviado a ${destinatario}`;
}

export async function demostrarIdempotencyKeys(): Promise<void> {
  paso("🔑", "Demostrando Idempotency Keys Pattern");
  contadorEnviosReales = 0;

  const registro = new RegistroIdempotencia();
  const clave = "email:cliente@example.com:factura-2026-08-001";

  paso("1️⃣", "Dos requests concurrentes con la misma clave → un único envío real");
  const [r1, r2] = await Promise.all([
    registro.ejecutar(clave, () => enviarEmailReal("cliente@example.com")),
    registro.ejecutar(clave, () => enviarEmailReal("cliente@example.com")),
  ]);
  console.log(`   Request A: ${r1.resultado} (repetido: ${r1.repetido})`);
  console.log(`   Request B: ${r2.resultado} (repetido: ${r2.repetido})`);
  console.log(`   Envíos reales: ${contadorEnviosReales} (debe ser 1)`);

  paso("2️⃣", "Un retry posterior obtiene el resultado persistido en memoria");
  const r3 = await registro.ejecutar(clave, () => enviarEmailReal("cliente@example.com"));
  console.log(`   Retry: ${r3.resultado} (repetido: ${r3.repetido})`);
  console.log(`   Envíos reales: ${contadorEnviosReales} (sigue siendo 1)`);

  paso("✅", "Idempotency Keys coalesciendo concurrencia dentro del proceso");
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
