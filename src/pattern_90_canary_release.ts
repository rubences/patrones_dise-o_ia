/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 90 — CANARY RELEASE (LANZAMIENTO PROGRESIVO)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [5% tráfico] ──▶ [Variante canary] ──▶ métricas
 *  [95% tráfico] ──▶ [Variante estable]
 *       │
 *  ¿Tasa de error del canary > umbral? ──SÍ──▶ Rollback automático a 0%
 *       │
 *      NO (con muestras suficientes)
 *       ▼
 *  Incrementar % del canary (5% → 25% → 50% → 100%)
 *
 *  Idea: en vez de reemplazar un prompt/modelo/agente de golpe para
 *  TODO el tráfico, se libera gradualmente a un porcentaje creciente,
 *  midiendo una señal de regresión en tiempo real. Si la señal empeora,
 *  el rollback es automático — no depende de que alguien revise un
 *  dashboard a tiempo.
 *
 *  Diferencia vs Patrón 75 (A/B Testing): A/B Testing divide el
 *  tráfico 50/50 (o proporción fija) durante toda la prueba y compara
 *  métricas al final para decidir manualmente el ganador. Canary
 *  Release empieza con MUY poco tráfico expuesto, incrementa
 *  progresivamente solo si la señal se mantiene sana, y revierte
 *  AUTOMÁTICAMENTE ante regresión — es un mecanismo de seguridad de
 *  despliegue, no un experimento estadístico.
 *
 *  Ventajas:
 *  - Blast radius mínimo si la nueva versión tiene un bug
 *  - Rollback automático sin intervención humana
 *  - Progresión gradual solo cuando hay evidencia de que va bien
 *  - Compone con Circuit Breaker (45): un canary con fallos también
 *    puede abrir su propio circuito
 */

import { isDirectRun, paso } from "./common.js";

export type Variante = "estable" | "canary";

export interface ConfigCanary {
  porcentajeInicial: number;
  incrementoPorPaso: number;
  umbralErrorMax: number; // 0.0–1.0
  minMuestrasPorPaso: number;
}

export class CanaryRelease {
  private porcentajeActual: number;
  private exitos = 0;
  private fallos = 0;
  private enRollback = false;

  constructor(private config: ConfigCanary) {
    this.porcentajeActual = config.porcentajeInicial;
  }

  decidirVariante(aleatorio: number = Math.random()): Variante {
    if (this.enRollback) return "estable";
    return aleatorio * 100 < this.porcentajeActual ? "canary" : "estable";
  }

  registrarResultado(variante: Variante, exito: boolean): void {
    if (variante !== "canary" || this.enRollback) return;

    exito ? this.exitos++ : this.fallos++;
    const total = this.exitos + this.fallos;
    if (total < this.config.minMuestrasPorPaso) return;

    const tasaError = this.fallos / total;
    if (tasaError > this.config.umbralErrorMax) {
      console.log(`   🔴 Tasa de error del canary (${(tasaError * 100).toFixed(0)}%) supera el umbral — ROLLBACK automático a 0%`);
      this.porcentajeActual = 0;
      this.enRollback = true;
    } else {
      const anterior = this.porcentajeActual;
      this.porcentajeActual = Math.min(100, this.porcentajeActual + this.config.incrementoPorPaso);
      console.log(`   🟢 Canary saludable (${(tasaError * 100).toFixed(0)}% error, umbral ${(this.config.umbralErrorMax * 100).toFixed(0)}%) — avanza ${anterior}% → ${this.porcentajeActual}%`);
    }
    this.exitos = 0;
    this.fallos = 0;
  }

  porcentajeActualDe(): number {
    return this.porcentajeActual;
  }
}

async function simularPasos(canary: CanaryRelease, resultadosSimulados: boolean[]): Promise<void> {
  for (const exito of resultadosSimulados) {
    const variante = canary.decidirVariante(0); // forzar "canary" para la simulación determinista
    canary.registrarResultado(variante, exito);
  }
}

export async function demostrarCanaryRelease(): Promise<void> {
  paso("🐤", "Demostrando Canary Release Pattern");

  paso("1️⃣", "Canary saludable: progresa automáticamente paso a paso");
  const canarySano = new CanaryRelease({ porcentajeInicial: 5, incrementoPorPaso: 25, umbralErrorMax: 0.1, minMuestrasPorPaso: 10 });
  await simularPasos(canarySano, Array(10).fill(true)); // 10 éxitos → avanza
  await simularPasos(canarySano, [...Array(9).fill(true), false]); // 9/10 éxitos (10% error, = umbral) → avanza
  console.log(`   Porcentaje final: ${canarySano.porcentajeActualDe()}%`);

  paso("2️⃣", "Canary con demasiados fallos: rollback automático, sin intervención humana");
  const canaryMalo = new CanaryRelease({ porcentajeInicial: 5, incrementoPorPaso: 25, umbralErrorMax: 0.1, minMuestrasPorPaso: 10 });
  await simularPasos(canaryMalo, [...Array(7).fill(true), false, false, false]); // 30% error > 10% umbral
  console.log(`   Porcentaje final: ${canaryMalo.porcentajeActualDe()}% (rollback)`);

  paso("3️⃣", "Tras rollback, todo el tráfico nuevo vuelve a la variante estable");
  const variante = canaryMalo.decidirVariante(0.01); // aunque el random favorecería canary
  console.log(`   Variante asignada tras rollback: ${variante}`);

  paso("✅", "Canary Release limitando el radio de impacto y revirtiendo solo automáticamente");
}

async function main(): Promise<void> {
  await demostrarCanaryRelease();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
