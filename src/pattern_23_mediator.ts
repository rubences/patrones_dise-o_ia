/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 23 — MEDIATOR (BEHAVIORAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *                    [Mediador Central]
 *                            ▲
 *                  ┌─────────┼─────────┐
 *                  │         │         │
 *                  ▼         ▼         ▼
 *              [Agente1] [Agente2] [Agente3]
 *
 *  Sin mediador: A↔B, A↔C, B↔C, A↔D, B↔D, C↔D (6 conexiones)
 *  Con mediador: A→M, B→M, C→M, D→M (4 conexiones + coordinación central)
 *
 *  Idea: Definir un objeto que encapsule cómo interactúan un conjunto
 *  de objetos. Promueve el acoplamiento débil.
 *
 *  Referencia: https://refactoring.guru/design-patterns/mediator
 *
 *  Ventajas:
 *  - Desacoplamiento entre agentes
 *  - Lógica de comunicación centralizada
 *  - Fácil de cambiar interacciones
 *  - Escalable
 *
 *  Casos de uso:
 *  - Coordinar múltiples agentes
 *  - Chat rooms con usuarios
 *  - Orquestación de procesos
 *  - Sistemas de control
 */

import { isDirectRun, paso } from "./common.js";

// ── Mediador (interfaz) ────────────────────────────────────────
export interface Mediador {
  registrarAgente(agente: AgenteConMediator): void;
  enviarMensaje(de: string, para: string, mensaje: string): void;
  notificarCambio(agente: string, evento: string): void;
}

// ── MEDIADOR CONCRETO ──────────────────────────────────────────
export class MediadorCentral implements Mediador {
  private agentes: Map<string, AgenteConMediator> = new Map();

  registrarAgente(agente: AgenteConMediator): void {
    this.agentes.set(agente.obtenerNombre(), agente);
    console.log(`   ✓ ${agente.obtenerNombre()} registrado en mediador`);
  }

  enviarMensaje(de: string, para: string, mensaje: string): void {
    const agenteDestino = this.agentes.get(para);

    if (!agenteDestino) {
      console.log(
        `   ✗ Agente "${para}" no encontrado`,
      );
      return;
    }

    console.log(`   💬 ${de} → ${para}: "${mensaje}"`);
    agenteDestino.recibirMensaje(de, mensaje);
  }

  notificarCambio(agente: string, evento: string): void {
    console.log(`   📢 [${agente}] Evento: ${evento}`);

    // Notificar a todos los demás agentes
    this.agentes.forEach((agenteObj, nombre) => {
      if (nombre !== agente) {
        agenteObj.manejarEventoExterno(agente, evento);
      }
    });
  }

  obtenerEstado(): Record<string, string[]> {
    const estado: Record<string, string[]> = {};
    this.agentes.forEach((agente, nombre) => {
      estado[nombre] = agente.obtenerHistorial();
    });
    return estado;
  }
}

// ── Agente (colegía del mediador) ──────────────────────────────
export class AgenteConMediator {
  private nombre: string;
  private mediador: Mediador;
  private historial: string[] = [];

  constructor(nombre: string, mediador: Mediador) {
    this.nombre = nombre;
    this.mediador = mediador;
    this.mediador.registrarAgente(this);
  }

  obtenerNombre(): string {
    return this.nombre;
  }

  enviarMensajeA(para: string, mensaje: string): void {
    this.historial.push(`enviado a ${para}: ${mensaje}`);
    this.mediador.enviarMensaje(this.nombre, para, mensaje);
  }

  recibirMensaje(de: string, mensaje: string): void {
    this.historial.push(`recibido de ${de}: ${mensaje}`);
    console.log(`      → ${this.nombre} recibió: "${mensaje}"`);
  }

  notificarEvento(evento: string): void {
    this.historial.push(`evento: ${evento}`);
    this.mediador.notificarCambio(this.nombre, evento);
  }

  manejarEventoExterno(agente: string, evento: string): void {
    this.historial.push(`evento de ${agente}: ${evento}`);
  }

  obtenerHistorial(): string[] {
    return [...this.historial];
  }

  mostrarHistorial(): void {
    console.log(`\n   📋 Historial de ${this.nombre}:`);
    this.historial.forEach((h, i) => console.log(`      ${i + 1}. ${h}`));
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export function demostrarMediator(): void {
  paso("🎛️", "Demostrando Mediator Pattern");

  paso("1️⃣", "Crear mediador y agentes");

  const mediador = new MediadorCentral();

  const investigador = new AgenteConMediator("Investigador", mediador);
  const desarrollador = new AgenteConMediator("Desarrollador", mediador);
  const revisor = new AgenteConMediator("Revisor", mediador);

  paso("2️⃣", "Comunicación coordinada a través del mediador");

  console.log(`\n   Flujo de trabajo:`);

  investigador.enviarMensajeA("Desarrollador", "Requisitos listos");
  desarrollador.enviarMensajeA("Revisor", "Código listo para revisión");
  revisor.enviarMensajeA("Desarrollador", "Cambios menores solicitados");
  desarrollador.enviarMensajeA("Investigador", "Validación de cambios");

  paso("3️⃣", "Eventos broadcast");

  console.log(`\n   Notificación de evento a todos:`);
  investigador.notificarEvento("Hallazgo importante encontrado");

  console.log(`\n   Otro evento:`);
  revisor.notificarEvento("Revisión completada con éxito");

  paso("4️⃣", "Historial de cada agente");

  investigador.mostrarHistorial();
  desarrollador.mostrarHistorial();
  revisor.mostrarHistorial();

  paso("✅", "Mediator coordinando comunicación correctamente");
}

function main(): void {
  demostrarMediator();
}

if (isDirectRun(import.meta.url)) {
  main();
}
