/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 18 — OBSERVER (BEHAVIORAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Agente (Subject)]
 *       │
 *       ├─ .subscribe(Observer1)
 *       ├─ .subscribe(Observer2)
 *       └─ .subscribe(Observer3)
 *
 *  [Cambio de estado] ───▶ notifica ───┬──▶ Observer1.update()
 *                                       ├──▶ Observer2.update()
 *                                       └──▶ Observer3.update()
 *
 *  Idea: Definir una dependencia uno-a-muchos entre objetos de forma que
 *  cuando uno cambie de estado, todos sus dependientes sean notificados.
 *
 *  Referencia: https://refactoring.guru/design-patterns/observer
 *
 *  Ventajas:
 *  - Desacoplamiento entre observables y observadores
 *  - Reactividad automática
 *  - Fácil agregar/remover observadores
 *  - Notificación en tiempo real
 *
 *  Casos de uso:
 *  - Reaccionar a cambios de estado del agente
 *  - Logging y monitoreo
 *  - UI updates
 *  - Pipelines reactivos
 */

import { isDirectRun, paso } from "./common.js";

// ── Observador (interfaz) ──────────────────────────────────────
export interface Observador {
  actualizar(evento: EventoCambio): void;
}

// ── Evento ─────────────────────────────────────────────────────
export interface EventoCambio {
  tipo: string;
  agente: string;
  estadoAnterior: unknown;
  estadoNuevo: unknown;
  timestamp: Date;
}

// ── OBSERVABLE: Agente que notifica cambios ───────────────────
export class AgenteObservable {
  private nombre: string;
  private estado: Record<string, unknown> = {};
  private observadores: Set<Observador> = new Set();

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  // Métodos para observadores
  suscribir(observador: Observador): void {
    this.observadores.add(observador);
    console.log(`   ✓ Observador suscrito a ${this.nombre}`);
  }

  desuscribir(observador: Observador): void {
    this.observadores.delete(observador);
  }

  private notificar(evento: EventoCambio): void {
    this.observadores.forEach((obs) => obs.actualizar(evento));
  }

  // Cambiar estado y notificar
  cambiarEstado(clave: string, valor: unknown): void {
    const anterior = this.estado[clave];

    this.estado[clave] = valor;

    const evento: EventoCambio = {
      tipo: "cambioEstado",
      agente: this.nombre,
      estadoAnterior: anterior,
      estadoNuevo: valor,
      timestamp: new Date(),
    };

    this.notificar(evento);
  }

  obtenerEstado(): Record<string, unknown> {
    return { ...this.estado };
  }
}

// ── OBSERVADORES concretos ─────────────────────────────────────
export class ObservadorLogger implements Observador {
  actualizar(evento: EventoCambio): void {
    console.log(
      `📝 [${evento.agente}] ${evento.tipo}: ${evento.estadoAnterior} → ${evento.estadoNuevo}`,
    );
  }
}

export class ObservadorMonitor implements Observador {
  private cambios: number = 0;

  actualizar(evento: EventoCambio): void {
    this.cambios++;
    console.log(
      `📊 [Monitor] Cambio #${this.cambios} en ${evento.agente}`,
    );
  }

  obtenerCambios(): number {
    return this.cambios;
  }
}

export class ObservadorAlerta implements Observador {
  actualizar(evento: EventoCambio): void {
    if (evento.estadoNuevo === "error") {
      console.log(`🚨 [ALERTA] ¡Error detectado en ${evento.agente}!`);
    }
  }
}

export class ObservadorPersistencia implements Observador {
  private historial: EventoCambio[] = [];

  actualizar(evento: EventoCambio): void {
    this.historial.push(evento);
    console.log(`💾 [Persistencia] Evento guardado. Total: ${this.historial.length}`);
  }

  obtenerHistorial(): EventoCambio[] {
    return [...this.historial];
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export function demostrarObserver(): void {
  paso("👁️", "Demostrando Observer Pattern");

  paso("1️⃣", "Crear agente y observadores");

  const agente = new AgenteObservable("Agente Principal");

  const logger = new ObservadorLogger();
  const monitor = new ObservadorMonitor();
  const alerta = new ObservadorAlerta();
  const persistencia = new ObservadorPersistencia();

  console.log(`\n   Suscribiendo observadores...`);
  agente.suscribir(logger);
  agente.suscribir(monitor);
  agente.suscribir(alerta);
  agente.suscribir(persistencia);

  paso("2️⃣", "Cambios de estado - notificación automática");

  console.log(`\n   Cambio 1: Inicializando...`);
  agente.cambiarEstado("status", "iniciado");

  console.log(`\n   Cambio 2: Procesando...`);
  agente.cambiarEstado("status", "procesando");

  console.log(`\n   Cambio 3: Completado...`);
  agente.cambiarEstado("status", "completado");

  console.log(`\n   Cambio 4: Error...`);
  agente.cambiarEstado("status", "error");

  paso("3️⃣", "Estadísticas finales");

  console.log(`
   Monitor: ${monitor.obtenerCambios()} cambios detectados
   Persistencia: ${persistencia.obtenerHistorial().length} eventos guardados
   Estado actual: ${JSON.stringify(agente.obtenerEstado())}
  `);
}

function main(): void {
  demostrarObserver();
}

if (isDirectRun(import.meta.url)) {
  main();
}
