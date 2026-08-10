/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 46 — BULKHEAD (AISLAMIENTO DE FALLOS)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Sin Bulkhead:
 *  [Agente1] ─┐
 *  [Agente2] ─┼─▶ [Pool Compartido] ← Si se satura, TODOS fallan
 *  [Agente3] ─┘
 *
 *  Con Bulkhead:
 *  [Agente1] ──▶ [Pool A: 3 hilos] ← fallo aislado
 *  [Agente2] ──▶ [Pool B: 5 hilos] ← fallo aislado
 *  [Agente3] ──▶ [Pool C: 2 hilos] ← fallo aislado
 *
 *  Idea: Aislar los recursos de cada componente para que el fallo
 *  de uno no afecte a los demás (como mamparos en un barco).
 *
 *  Ventajas:
 *  - Aislamiento de fallos
 *  - Cuotas de recursos por servicio
 *  - Previene degradación general
 *  - Priorización de recursos críticos
 */

import { isDirectRun, paso } from "./common.js";

export interface ConfigBulkhead {
  nombre: string;
  maxConcurrentes: number;
  timeoutMs: number;
}

export class Bulkhead {
  private nombre: string;
  private maxConcurrentes: number;
  private timeoutMs: number;
  private activos = 0;
  private estadisticas = { aceptadas: 0, rechazadas: 0, completadas: 0 };

  constructor(config: ConfigBulkhead) {
    this.nombre = config.nombre;
    this.maxConcurrentes = config.maxConcurrentes;
    this.timeoutMs = config.timeoutMs;
  }

  async ejecutar<T>(operacion: () => Promise<T>): Promise<T> {
    if (this.activos >= this.maxConcurrentes) {
      this.estadisticas.rechazadas++;
      throw new Error(`[${this.nombre}] Bulkhead lleno (${this.activos}/${this.maxConcurrentes})`);
    }

    this.activos++;
    this.estadisticas.aceptadas++;

    try {
      const resultado = await Promise.race([
        operacion(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`[${this.nombre}] Timeout ${this.timeoutMs}ms`)), this.timeoutMs),
        ),
      ]);
      this.estadisticas.completadas++;
      return resultado;
    } finally {
      this.activos--;
    }
  }

  obtenerEstado(): {
    nombre: string;
    activos: number;
    capacidad: number;
    estadisticas: { aceptadas: number; rechazadas: number; completadas: number };
  } {
    return {
      nombre: this.nombre,
      activos: this.activos,
      capacidad: this.maxConcurrentes,
      estadisticas: { ...this.estadisticas },
    };
  }
}

export class GestorBulkheads {
  private bulkheads: Map<string, Bulkhead> = new Map();

  crear(config: ConfigBulkhead): void {
    this.bulkheads.set(config.nombre, new Bulkhead(config));
    console.log(`   ✓ Bulkhead creado: ${config.nombre} (máx ${config.maxConcurrentes} concurrentes)`);
  }

  async ejecutar<T>(nombre: string, operacion: () => Promise<T>): Promise<T> {
    const bh = this.bulkheads.get(nombre);
    if (!bh) throw new Error(`Bulkhead ${nombre} no encontrado`);
    return bh.ejecutar(operacion);
  }

  mostrarEstados(): void {
    console.log(`\n   📊 Estado de Bulkheads:`);
    this.bulkheads.forEach((bh) => {
      const e = bh.obtenerEstado();
      const uso = Math.round((e.activos / e.capacidad) * 100);
      console.log(`   ${e.nombre}: ${e.activos}/${e.capacidad} (${uso}%) | ✓${e.estadisticas.completadas} ✗${e.estadisticas.rechazadas}`);
    });
  }
}

export async function demostrarBulkhead(): Promise<void> {
  paso("🚢", "Demostrando Bulkhead Pattern");

  const gestor = new GestorBulkheads();

  console.log(`\n   Creando pools de recursos aislados...`);
  gestor.crear({ nombre: "agentes-criticos", maxConcurrentes: 3, timeoutMs: 2000 });
  gestor.crear({ nombre: "agentes-normales", maxConcurrentes: 5, timeoutMs: 5000 });
  gestor.crear({ nombre: "tareas-background", maxConcurrentes: 2, timeoutMs: 10000 });

  paso("1️⃣", "Saturar pool de tareas-background (no afecta a críticos)");

  const tareasBackground: Promise<unknown>[] = [];

  // Llenar pool background (máx 2)
  for (let i = 0; i < 4; i++) {
    const promesa = gestor.ejecutar("tareas-background", async () => {
      await new Promise((r) => setTimeout(r, 300));
      return `Background ${i + 1} completado`;
    }).catch((e: Error) => `RECHAZADO: ${e.message}`);
    tareasBackground.push(promesa);
  }

  const resultadosBackground = await Promise.all(tareasBackground);
  resultadosBackground.forEach((r) => console.log(`   ${r}`));

  paso("2️⃣", "Agentes críticos siguen funcionando");

  const critica = await gestor.ejecutar(
    "agentes-criticos",
    async () => "✅ Tarea crítica procesada correctamente",
  );
  console.log(`\n   ${critica}`);

  paso("3️⃣", "Estado de todos los bulkheads");
  gestor.mostrarEstados();

  paso("✅", "Bulkhead aislando fallos entre pools de recursos independientes");
}

function main(): void {
  demostrarBulkhead().catch((e: unknown) => { console.error(e); process.exitCode = 1; });
}

if (isDirectRun(import.meta.url)) {
  main();
}
