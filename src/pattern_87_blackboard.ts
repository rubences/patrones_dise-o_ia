/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 87 — BLACKBOARD (PIZARRA COMPARTIDA)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Pizarra compartida: espacio clave-valor con suscripciones]
 *       ▲  │              ▲  │              ▲  │
 *       │  ▼              │  ▼              │  ▼
 *  [Agente A]         [Agente B]         [Agente C]
 *  detector            analista           generador
 *  de anomalías        de riesgo          de reporte
 *
 *  Sin coordinador central: cada agente se SUSCRIBE a las claves que
 *  le interesan y ESCRIBE cuando termina su parte. El siguiente
 *  agente reacciona automáticamente cuando su dato de entrada aparece
 *  — nadie decide "ahora le toca a B", B simplemente reacciona.
 *
 *  Diferencia vs Patrón 23 (Mediator): Mediator centraliza la
 *  comunicación — todos los mensajes pasan por un hub que decide el
 *  enrutamiento. Blackboard no tiene hub: los agentes leen/escriben
 *  un espacio compartido de forma oportunista y reaccionan a cambios.
 *
 *  Diferencia vs Patrón 60 (Orchestrator-Workers): Orchestrator
 *  asigna tareas explícitamente top-down a workers. En Blackboard el
 *  orden de ejecución EMERGE de qué datos van apareciendo — es la
 *  topología clásica de sistemas expertos (Hearsay-II) aplicada a
 *  agentes de IA.
 *
 *  Ventajas:
 *  - Agentes totalmente desacoplados entre sí (solo conocen la pizarra)
 *  - Añadir un agente nuevo no requiere tocar a los demás
 *  - El orden de ejecución emerge de la disponibilidad de datos, no
 *    de un plan fijo — útil cuando el flujo no es lineal ni conocido
 *    de antemano
 *  - Todos los agentes ven el estado global compartido para colaborar
 */

import { isDirectRun, paso } from "./common.js";

export type Suscriptor = (clave: string, valor: unknown, pizarra: Blackboard) => void | Promise<void>;

export class Blackboard {
  private datos = new Map<string, unknown>();
  private suscriptores = new Map<string, Suscriptor[]>();
  private historial: { clave: string; agente: string }[] = [];

  suscribir(clave: string, callback: Suscriptor): void {
    const lista = this.suscriptores.get(clave) ?? [];
    lista.push(callback);
    this.suscriptores.set(clave, lista);
  }

  async escribir(clave: string, valor: unknown, agente: string): Promise<void> {
    console.log(`   ✍️  [${agente}] escribe "${clave}"`);
    this.datos.set(clave, valor);
    this.historial.push({ clave, agente });

    const suscriptores = this.suscriptores.get(clave) ?? [];
    for (const callback of suscriptores) {
      await callback(clave, valor, this);
    }
  }

  leer<T>(clave: string): T | undefined {
    return this.datos.get(clave) as T | undefined;
  }

  obtenerHistorial(): { clave: string; agente: string }[] {
    return [...this.historial];
  }
}

// ── Tres agentes independientes que nunca se llaman entre sí directamente ──
async function registrarDetectorAnomalias(pizarra: Blackboard): Promise<void> {
  // Simplemente escribe cuando "detecta" algo — no sabe quién lo consumirá.
  // Como `escribir` espera a cada suscriptor (que a su vez puede volver a
  // escribir), este await deja correr toda la cadena reactiva completa.
  await pizarra.escribir(
    "anomalia_detectada",
    { activo: "servidor-web-03", metrica: "cpu", valor: 97 },
    "detector_anomalias",
  );
}

function registrarAnalistaRiesgo(pizarra: Blackboard): void {
  pizarra.suscribir("anomalia_detectada", async (_clave, valor, pb) => {
    const anomalia = valor as { activo: string; metrica: string; valor: number };
    const riesgo = anomalia.valor > 90 ? "alto" : "medio";
    await pb.escribir("evaluacion_riesgo", { activo: anomalia.activo, nivel: riesgo }, "analista_riesgo");
  });
}

function registrarGeneradorReporte(pizarra: Blackboard): void {
  pizarra.suscribir("evaluacion_riesgo", async (_clave, valor, pb) => {
    const evaluacion = valor as { activo: string; nivel: string };
    await pb.escribir(
      "reporte_final",
      `Reporte: ${evaluacion.activo} tiene riesgo ${evaluacion.nivel}. Acción recomendada: escalar a SRE.`,
      "generador_reporte",
    );
  });
}

export async function demostrarBlackboard(): Promise<void> {
  paso("📋", "Demostrando Blackboard Pattern");

  const pizarra = new Blackboard();

  paso("1️⃣", "Registrar 3 agentes independientes (ninguno conoce a los otros)");
  registrarAnalistaRiesgo(pizarra); // se suscribe ANTES de que exista el dato
  registrarGeneradorReporte(pizarra);
  console.log("   ✓ analista_riesgo y generador_reporte suscritos, esperando datos");

  paso("2️⃣", "detector_anomalias escribe — dispara la cadena SIN que nadie la orqueste");
  await registrarDetectorAnomalias(pizarra);

  paso("3️⃣", "Estado final de la pizarra y orden emergente de ejecución");
  console.log(`   reporte_final: "${pizarra.leer("reporte_final")}"`);
  console.log(`   Orden emergente: ${pizarra.obtenerHistorial().map((h) => h.agente).join(" → ")}`);

  paso("✅", "Blackboard coordinando agentes sin un orquestador central explícito");
}

async function main(): Promise<void> {
  await demostrarBlackboard();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
