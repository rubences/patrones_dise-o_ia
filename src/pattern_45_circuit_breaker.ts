/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 45 — CIRCUIT BREAKER (INTERRUPTOR DE CIRCUITO)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Estado: CERRADO] ← Normal
 *       │
 *  Fallo detectado
 *       │
 *  Umbral superado?
 *       │
 *      SÍ
 *       │
 *       ▼
 *  [Estado: ABIERTO] ← Rechaza peticiones, respuesta fallback
 *       │
 *  Timeout de reset
 *       │
 *       ▼
 *  [Estado: SEMI-ABIERTO] ← Permite 1 petición de prueba
 *       │
 *  ¿Éxito?──SÍ──▶ [CERRADO]
 *       │
 *      NO──────▶ [ABIERTO]
 *
 *  Idea: Evitar llamadas repetidas a un servicio que está fallando,
 *  protegiéndolo y evitando fallos en cascada.
 *
 *  Ventajas:
 *  - Previene fallos en cascada
 *  - Respuesta rápida cuando hay fallos (fallback)
 *  - Auto-recuperación
 *  - Monitoreo del estado del servicio
 */

import { isDirectRun, paso } from "./common.js";

export type EstadoCircuito = "cerrado" | "abierto" | "semi-abierto";

export interface ConfigCircuitBreaker {
  umbralFallos: number;       // Fallos antes de abrir
  timeoutReset: number;       // Ms antes de pasar a semi-abierto
  fallbackRespuesta: string;  // Respuesta cuando está abierto
}

export class CircuitBreaker {
  private estado: EstadoCircuito = "cerrado";
  private fallosConsecutivos = 0;
  private ultimoFallo: Date | null = null;
  private config: ConfigCircuitBreaker;
  private nombre: string;

  constructor(nombre: string, config: ConfigCircuitBreaker) {
    this.nombre = nombre;
    this.config = config;
  }

  async ejecutar<T>(operacion: () => Promise<T>): Promise<T> {
    this.actualizarEstado();

    if (this.estado === "abierto") {
      console.log(`   🔴 [${this.nombre}] Circuito ABIERTO → Usando fallback`);
      return this.config.fallbackRespuesta as unknown as T;
    }

    try {
      const resultado = await operacion();
      this.registrarExito();
      return resultado;
    } catch (error) {
      this.registrarFallo();
      throw error;
    }
  }

  private actualizarEstado(): void {
    if (this.estado === "abierto" && this.ultimoFallo) {
      const tiempoTranscurrido = Date.now() - this.ultimoFallo.getTime();
      if (tiempoTranscurrido >= this.config.timeoutReset) {
        this.estado = "semi-abierto";
        console.log(`   🟡 [${this.nombre}] Circuito → SEMI-ABIERTO (prueba)`);
      }
    }
  }

  private registrarExito(): void {
    if (this.estado === "semi-abierto") {
      console.log(`   🟢 [${this.nombre}] Circuito → CERRADO (recuperado)`);
    }
    this.fallosConsecutivos = 0;
    this.estado = "cerrado";
  }

  private registrarFallo(): void {
    this.fallosConsecutivos++;
    this.ultimoFallo = new Date();

    console.log(`   ⚠️  [${this.nombre}] Fallo ${this.fallosConsecutivos}/${this.config.umbralFallos}`);

    if (this.fallosConsecutivos >= this.config.umbralFallos || this.estado === "semi-abierto") {
      this.estado = "abierto";
      console.log(`   🔴 [${this.nombre}] Circuito → ABIERTO (${this.config.timeoutReset}ms timeout)`);
    }
  }

  obtenerEstado(): { estado: EstadoCircuito; fallos: number } {
    return { estado: this.estado, fallos: this.fallosConsecutivos };
  }
}

// Gestor con múltiples circuit breakers para distintos servicios
export class GestorCircuitBreakers {
  private breakers: Map<string, CircuitBreaker> = new Map();

  registrar(nombre: string, config: ConfigCircuitBreaker): void {
    this.breakers.set(nombre, new CircuitBreaker(nombre, config));
    console.log(`   ✓ CircuitBreaker registrado: ${nombre}`);
  }

  async llamar<T>(servicio: string, operacion: () => Promise<T>): Promise<T> {
    const breaker = this.breakers.get(servicio);
    if (!breaker) throw new Error(`Servicio ${servicio} no registrado`);
    return breaker.ejecutar(operacion);
  }

  obtenerEstados(): Record<string, { estado: EstadoCircuito; fallos: number }> {
    const estados: Record<string, { estado: EstadoCircuito; fallos: number }> = {};
    this.breakers.forEach((b, nombre) => { estados[nombre] = b.obtenerEstado(); });
    return estados;
  }
}

export async function demostrarCircuitBreaker(): Promise<void> {
  paso("🔌", "Demostrando Circuit Breaker Pattern");

  const gestor = new GestorCircuitBreakers();

  gestor.registrar("api-llm", {
    umbralFallos: 3,
    timeoutReset: 500,
    fallbackRespuesta: "Servicio temporalmente no disponible. Respuesta en caché.",
  });

  paso("1️⃣", "Llamadas exitosas (circuito CERRADO)");
  for (let i = 0; i < 2; i++) {
    const r = await gestor.llamar("api-llm", async () => `Respuesta exitosa ${i + 1}`);
    console.log(`   Resultado: ${r}`);
  }

  paso("2️⃣", "Fallos acumulados → circuito ABIERTO");
  for (let i = 0; i < 4; i++) {
    try {
      await gestor.llamar("api-llm", async () => {
        throw new Error("API timeout");
      });
    } catch {
      // esperado
    }
  }

  paso("3️⃣", "Llamada con circuito ABIERTO → fallback inmediato");
  const fallback = await gestor.llamar("api-llm", async () => "nunca se ejecuta");
  console.log(`\n   Fallback recibido: "${fallback}"`);

  paso("4️⃣", "Estado de todos los circuit breakers");
  const estados = gestor.obtenerEstados();
  Object.entries(estados).forEach(([nombre, e]) => {
    console.log(`   ${nombre}: ${e.estado.toUpperCase()} (${e.fallos} fallos)`);
  });

  paso("✅", "Circuit Breaker evitando fallos en cascada con recuperación automática");
}

function main(): void {
  demostrarCircuitBreaker().catch((e: unknown) => { console.error(e); process.exitCode = 1; });
}

if (isDirectRun(import.meta.url)) {
  main();
}
