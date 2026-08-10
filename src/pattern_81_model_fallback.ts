/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 81 — MODEL FALLBACK / MULTI-PROVIDER REDUNDANCY
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Solicitud]
 *       │
 *       ▼
 *  [Proveedor primario] ──falla/rate-limit──▶ [Proveedor secundario]
 *       │ éxito                                    │ falla
 *       ▼                                           ▼
 *  [Respuesta] ◀──────────────── éxito ──── [Proveedor terciario]
 *                                                    │
 *                                              todos fallan
 *                                                    ▼
 *                                         [Error agregado con motivo
 *                                          de cada intento]
 *
 *  Idea: si el proveedor de LLM (o la región/despliegue) principal no
 *  está disponible, no debe caer el servicio — se reintenta con
 *  proveedores alternativos en orden de preferencia.
 *
 *  Diferencia vs Patrón 39 (Cascade): Cascade escala a un modelo más
 *  caro dentro del MISMO proveedor cuando la confianza de una
 *  respuesta EXITOSA es baja (optimiza coste/calidad). Este patrón
 *  conmuta a un PROVEEDOR distinto únicamente cuando el actual FALLA
 *  o está rate-limited (optimiza disponibilidad/resiliencia). Se
 *  pueden combinar: cada nivel de la cascada podría, a su vez, tener
 *  fallback multi-proveedor.
 *
 *  Ventajas:
 *  - Resiliencia ante caída o rate-limit de un proveedor concreto
 *  - Sin cambios para el llamador: misma interfaz, distinta fuente
 *  - Registro de qué proveedor respondió, para auditoría/coste
 *  - Se compone con Circuit Breaker (Patrón 45) por proveedor
 */

import { isDirectRun, paso } from "./common.js";

export interface ProveedorLLM {
  nombre: string;
  completar(prompt: string): Promise<string>;
}

export interface ResultadoFallback {
  respuesta: string;
  proveedorUsado: string;
  intentos: { proveedor: string; error?: string }[];
}

export class RateLimitError extends Error {
  constructor(proveedor: string) {
    super(`[${proveedor}] rate limit excedido`);
    this.name = "RateLimitError";
  }
}

export class FallbackMultiProveedor {
  constructor(private proveedores: ProveedorLLM[]) {
    if (proveedores.length === 0) {
      throw new Error("FallbackMultiProveedor requiere al menos un proveedor");
    }
  }

  async completar(prompt: string): Promise<ResultadoFallback> {
    const intentos: { proveedor: string; error?: string }[] = [];

    for (const proveedor of this.proveedores) {
      try {
        console.log(`   🔄 Intentando con ${proveedor.nombre}...`);
        const respuesta = await proveedor.completar(prompt);
        intentos.push({ proveedor: proveedor.nombre });
        console.log(`   ✅ ${proveedor.nombre} respondió correctamente`);
        return { respuesta, proveedorUsado: proveedor.nombre, intentos };
      } catch (error) {
        const mensaje = error instanceof Error ? error.message : String(error);
        intentos.push({ proveedor: proveedor.nombre, error: mensaje });
        console.log(`   ❌ ${proveedor.nombre} falló: ${mensaje}`);
      }
    }

    const resumen = intentos.map((i) => `${i.proveedor}: ${i.error}`).join(" | ");
    throw new Error(`Todos los proveedores fallaron — ${resumen}`);
  }
}

// ── Proveedores simulados para la demo (sin requerir múltiples API keys) ──
function proveedorSimulado(nombre: string, comportamiento: "ok" | "rate_limit" | "error"): ProveedorLLM {
  return {
    nombre,
    async completar(prompt: string): Promise<string> {
      await new Promise((r) => setTimeout(r, 20));
      if (comportamiento === "rate_limit") throw new RateLimitError(nombre);
      if (comportamiento === "error") throw new Error(`[${nombre}] servicio no disponible (503)`);
      return `Respuesta de ${nombre} para: "${prompt.slice(0, 40)}..."`;
    },
  };
}

export async function demostrarModelFallback(): Promise<void> {
  paso("🔀", "Demostrando Model Fallback / Multi-Provider Redundancy Pattern");

  paso("1️⃣", "Proveedor primario caído → conmuta al secundario");
  const fallback1 = new FallbackMultiProveedor([
    proveedorSimulado("OpenAI-primary", "error"),
    proveedorSimulado("Azure-OpenAI-secondary", "ok"),
    proveedorSimulado("Anthropic-tertiary", "ok"),
  ]);
  const r1 = await fallback1.completar("¿Cuál es el patrón Circuit Breaker?");
  console.log(`\n   Proveedor usado: ${r1.proveedorUsado}`);
  console.log(`   Respuesta: "${r1.respuesta}"`);

  paso("2️⃣", "Primario rate-limited, secundario caído → llega al terciario");
  const fallback2 = new FallbackMultiProveedor([
    proveedorSimulado("OpenAI-primary", "rate_limit"),
    proveedorSimulado("Azure-OpenAI-secondary", "error"),
    proveedorSimulado("Anthropic-tertiary", "ok"),
  ]);
  const r2 = await fallback2.completar("Resume el patrón Rate Limiting");
  console.log(`\n   Proveedor usado: ${r2.proveedorUsado}`);
  console.log(`   Intentos: ${r2.intentos.map((i) => `${i.proveedor}${i.error ? " (falló)" : " (ok)"}`).join(" → ")}`);

  paso("3️⃣", "Todos los proveedores fallan → error agregado con el motivo de cada intento");
  const fallback3 = new FallbackMultiProveedor([
    proveedorSimulado("OpenAI-primary", "rate_limit"),
    proveedorSimulado("Azure-OpenAI-secondary", "error"),
  ]);
  try {
    await fallback3.completar("Esto no debería responder");
  } catch (error) {
    console.log(`\n   Error final: ${error instanceof Error ? error.message : error}`);
  }

  paso("✅", "Model Fallback manteniendo disponibilidad ante caída de un proveedor concreto");
}

async function main(): Promise<void> {
  await demostrarModelFallback();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
