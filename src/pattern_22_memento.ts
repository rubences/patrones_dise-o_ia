/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 22 — MEMENTO (BEHAVIORAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Agente Conversacional]
 *       │
 *       ├─ cambio 1 ──▶ crearMemento() ──▶ Memento {estado}
 *       │
 *       ├─ cambio 2 ──▶ crearMemento() ──▶ Memento {estado}
 *       │
 *       └─ cambio 3 ──▶ crearMemento() ──▶ Memento {estado}
 *
 *  [Usuario quiere volver atrás]
 *       │
 *       ▼
 *  restaurarDesdeMemento(mementoAnterior) ──▶ Agente vuelve al estado anterior
 *
 *  Idea: Capturar y externalizar el estado interno de un objeto sin
 *  violar el encapsulamiento, permitiendo restaurarlo después.
 *
 *  Referencia: https://refactoring.guru/design-patterns/memento
 *
 *  Ventajas:
 *  - Snapshots del estado
 *  - Undo/Redo
 *  - Historial de conversaciones
 *  - Rollback de operaciones
 *
 *  Casos de uso:
 *  - Historial de conversaciones
 *  - Puntos de guardado
 *  - Análisis de evolución del estado
 */

import { isDirectRun, paso } from "./common.js";

// ── MEMENTO: Capsula de estado ─────────────────────────────────
export interface Memento {
  obtenerEstado(): Record<string, unknown>;
  obtenerTimestamp(): Date;
  obtenerDescripcion(): string;
}

export class MementoAgente implements Memento {
  private estado: Record<string, unknown>;
  private timestamp: Date;
  private descripcion: string;

  constructor(
    estado: Record<string, unknown>,
    descripcion: string = "",
  ) {
    this.estado = JSON.parse(JSON.stringify(estado)); // Deep copy
    this.timestamp = new Date();
    this.descripcion = descripcion;
  }

  obtenerEstado(): Record<string, unknown> {
    return JSON.parse(JSON.stringify(this.estado));
  }

  obtenerTimestamp(): Date {
    return this.timestamp;
  }

  obtenerDescripcion(): string {
    return this.descripcion;
  }
}

// ── ORIGINATOR: Agente que genera mementos ─────────────────────
export class AgenteConMemento {
  private nombre: string;
  private estado: Record<string, unknown> = {};
  private paso: number = 0;

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  cambiarEstado(clave: string, valor: unknown): void {
    this.estado[clave] = valor;
    this.paso++;
    console.log(
      `   ${this.nombre}: Estado cambió. Paso ${this.paso}`,
    );
  }

  crearMemento(descripcion = ""): Memento {
    const memento = new MementoAgente(
      this.estado,
      descripcion || `Paso ${this.paso}`,
    );
    console.log(
      `   💾 Memento guardado: ${descripcion || `Paso ${this.paso}`}`,
    );
    return memento;
  }

  restaurarDesdeMemento(memento: Memento): void {
    this.estado = memento.obtenerEstado();
    console.log(
      `   ↶ Restaurado desde: ${memento.obtenerDescripcion()}`,
    );
  }

  obtenerEstado(): Record<string, unknown> {
    return { ...this.estado };
  }

  mostrarEstado(): void {
    console.log(`   Estado actual: ${JSON.stringify(this.estado)}`);
  }
}

// ── CARETAKER: Gestor de mementos (historial) ──────────────────
export class GestorHistorial {
  private historial: Array<{
    memento: Memento;
    descripcion: string;
  }> = [];
  private indiceActual: number = -1;

  guardarEstado(memento: Memento, descripcion: string): void {
    // Remover futuros si estamos en mitad del historial
    this.historial = this.historial.slice(0, this.indiceActual + 1);

    this.historial.push({ memento, descripcion });
    this.indiceActual++;
    console.log(`   📚 Historial actualizado (${this.historial.length} puntos)`);
  }

  irAtras(): Memento | null {
    if (this.indiceActual > 0) {
      this.indiceActual--;
      return this.historial[this.indiceActual].memento;
    }
    return null;
  }

  irAdelante(): Memento | null {
    if (this.indiceActual < this.historial.length - 1) {
      this.indiceActual++;
      return this.historial[this.indiceActual].memento;
    }
    return null;
  }

  obtenerHistorial(): Array<{ descripcion: string; timestamp: Date }> {
    return this.historial.map((h) => ({
      descripcion: h.descripcion,
      timestamp: h.memento.obtenerTimestamp(),
    }));
  }

  mostrarHistorial(): void {
    console.log(`\n   📜 Historial de cambios:`);
    this.historial.forEach((h, i) => {
      const marca = i === this.indiceActual ? " ←" : "";
      console.log(`      ${i + 1}. ${h.descripcion}${marca}`);
    });
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export function demostrarMemento(): void {
  paso("📸", "Demostrando Memento Pattern");

  paso("1️⃣", "Conversar y guardar snapshots");

  const agente = new AgenteConMemento("ChatBot");
  const historial = new GestorHistorial();

  console.log(`\n   Inicio de conversación:`);
  agente.cambiarEstado("contexto", "usuario_nuevo");
  agente.mostrarEstado();
  let memento = agente.crearMemento("Estado inicial");
  historial.guardarEstado(memento, "Estado inicial");

  console.log(`\n   Momento 1: Usuario proporciona nombre`);
  agente.cambiarEstado("usuario_nombre", "Alice");
  agente.cambiarEstado("contexto", "presentacion");
  agente.mostrarEstado();
  memento = agente.crearMemento("Usuario se presentó");
  historial.guardarEstado(memento, "Usuario se presentó");

  console.log(`\n   Momento 2: Conversación continúa`);
  agente.cambiarEstado("mensajes_contados", 5);
  agente.cambiarEstado("contexto", "conversacion_activa");
  agente.mostrarEstado();
  memento = agente.crearMemento("Conversación iniciada");
  historial.guardarEstado(memento, "Conversación iniciada");

  console.log(`\n   Momento 3: Cambio de tema`);
  agente.cambiarEstado("tema", "tecnologia");
  agente.cambiarEstado("contexto", "cambio_tema");
  agente.mostrarEstado();
  memento = agente.crearMemento("Cambio de tema");
  historial.guardarEstado(memento, "Cambio de tema");

  paso("2️⃣", "Navegar en el historial");

  historial.mostrarHistorial();

  console.log(`\n   Volviendo atrás...`);
  let mementoAtras = historial.irAtras();
  if (mementoAtras) {
    agente.restaurarDesdeMemento(mementoAtras);
    agente.mostrarEstado();
  }

  console.log(`\n   Volviendo atrás de nuevo...`);
  mementoAtras = historial.irAtras();
  if (mementoAtras) {
    agente.restaurarDesdeMemento(mementoAtras);
    agente.mostrarEstado();
  }

  console.log(`\n   Yendo adelante...`);
  let mementoAdelante = historial.irAdelante();
  if (mementoAdelante) {
    agente.restaurarDesdeMemento(mementoAdelante);
    agente.mostrarEstado();
  }

  paso("✅", "Historial de snapshots completado");
}

function main(): void {
  demostrarMemento();
}

if (isDirectRun(import.meta.url)) {
  main();
}
