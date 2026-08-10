/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 94 — HEALTH CHECK / READINESS PROBE (SONDA DE SALUD)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Cada N segundos, PROACTIVO — sin depender de tráfico real]
 *       │
 *       ▼
 *  [Monitor de Salud]
 *  ├─ check("llm_provider")   → ¿responde el proveedor?
 *  ├─ check("vector_db")      → ¿responde la base vectorial?
 *  └─ check("cache")          → ¿responde la caché?
 *       │
 *       ▼
 *  Estado global = el peor estado individual
 *  (sano | degradado | no_disponible)
 *       │
 *       ▼
 *  Expuesto en /health para el orquestador (K8s, load balancer...)
 *
 *  Idea: verificar PROACTIVAMENTE, de forma periódica e independiente
 *  del tráfico real, que cada dependencia crítica está disponible.
 *  Un orquestador (Kubernetes, un load balancer) usa esto para decidir
 *  si debe seguir enrutando tráfico a esta instancia o sacarla de
 *  circulación antes de que un usuario real sufra el fallo.
 *
 *  Diferencia vs Patrón 45 (Circuit Breaker): Circuit Breaker es
 *  REACTIVO — solo se entera de que un servicio falla cuando una
 *  llamada REAL falla, y protege llamadas futuras. Health Check es
 *  PROACTIVO — verifica el estado incluso sin tráfico, permitiendo
 *  detectar (y sacar de servicio) una instancia rota ANTES de que
 *  reciba una sola petición de un usuario real.
 *
 *  Ventajas:
 *  - Detecta fallos sin esperar a que un usuario los sufra
 *  - Un orquestador externo puede dejar de enrutar tráfico automáticamente
 *  - Estado "degradado" (no binario) permite decisiones más finas
 *    que un simple arriba/abajo
 *  - Complementa a Circuit Breaker (45): un check puede exponer el
 *    estado agregado de varios breakers
 */

import { isDirectRun, paso } from "./common.js";

export type EstadoSalud = "sano" | "degradado" | "no_disponible";

export interface ResultadoCheck {
  nombre: string;
  estado: EstadoSalud;
  detalle?: string;
  duracionMs: number;
}

export interface ResultadoSaludGlobal {
  estadoGlobal: EstadoSalud;
  checks: ResultadoCheck[];
  timestamp: number;
}

export type FuncionCheck = () => Promise<{ estado: EstadoSalud; detalle?: string }>;

const PRIORIDAD: Record<EstadoSalud, number> = { sano: 0, degradado: 1, no_disponible: 2 };

export class MonitorSalud {
  private checks = new Map<string, FuncionCheck>();

  registrar(nombre: string, check: FuncionCheck): void {
    this.checks.set(nombre, check);
  }

  async verificar(): Promise<ResultadoSaludGlobal> {
    const resultados: ResultadoCheck[] = [];

    for (const [nombre, check] of this.checks) {
      const inicio = Date.now();
      try {
        const { estado, detalle } = await check();
        resultados.push({ nombre, estado, detalle, duracionMs: Date.now() - inicio });
      } catch (error) {
        resultados.push({
          nombre,
          estado: "no_disponible",
          detalle: error instanceof Error ? error.message : String(error),
          duracionMs: Date.now() - inicio,
        });
      }
    }

    const estadoGlobal = resultados.reduce<EstadoSalud>(
      (peor, r) => (PRIORIDAD[r.estado] > PRIORIDAD[peor] ? r.estado : peor),
      "sano",
    );

    return { estadoGlobal, checks: resultados, timestamp: Date.now() };
  }
}

function iconoDe(estado: EstadoSalud): string {
  return estado === "sano" ? "✅" : estado === "degradado" ? "⚠️" : "🔴";
}

export async function demostrarHealthCheck(): Promise<void> {
  paso("🩺", "Demostrando Health Check / Readiness Probe Pattern");

  const monitor = new MonitorSalud();
  monitor.registrar("llm_provider", async () => ({ estado: "sano", detalle: "p99 latencia 340ms" }));
  monitor.registrar("vector_db", async () => ({ estado: "degradado", detalle: "latencia elevada (p99 2.1s)" }));
  monitor.registrar("cache", async () => ({ estado: "sano" }));

  paso("1️⃣", "Ciclo de verificación (independiente de tráfico real de usuarios)");
  const resultado1 = await monitor.verificar();
  resultado1.checks.forEach((c) => console.log(`   ${iconoDe(c.estado)} ${c.nombre}: ${c.estado}${c.detalle ? ` — ${c.detalle}` : ""} (${c.duracionMs}ms)`));
  console.log(`\n   Estado global: ${resultado1.estadoGlobal.toUpperCase()} (el peor de los checks individuales)`);

  paso("2️⃣", "Una dependencia cae por completo → estado global se degrada a no_disponible");
  const monitorConFallo = new MonitorSalud();
  monitorConFallo.registrar("llm_provider", async () => ({ estado: "sano" }));
  monitorConFallo.registrar("vector_db", async () => {
    throw new Error("connection refused");
  });
  const resultado2 = await monitorConFallo.verificar();
  resultado2.checks.forEach((c) => console.log(`   ${iconoDe(c.estado)} ${c.nombre}: ${c.estado}${c.detalle ? ` — ${c.detalle}` : ""}`));
  console.log(`\n   Estado global: ${resultado2.estadoGlobal.toUpperCase()} → un orquestador externo dejaría de enrutar tráfico aquí`);

  paso("✅", "Health Check detectando problemas antes de que los sufra un usuario real");
}

async function main(): Promise<void> {
  await demostrarHealthCheck();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
