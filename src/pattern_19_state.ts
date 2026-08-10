/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 19 — STATE (BEHAVIORAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Agente]
 *    │
 *    ├─ estado: Inicializado
 *    │  └─ acciones permitidas: iniciar
 *    │
 *    ├─ estado: Ejecutando
 *    │  └─ acciones permitidas: pausar, cancelar, completar
 *    │
 *    ├─ estado: Pausado
 *    │  └─ acciones permitidas: reanudar, cancelar
 *    │
 *    └─ estado: Completado
 *       └─ acciones permitidas: reiniciar
 *
 *  Idea: Permitir que un objeto altere su comportamiento cuando su
 *  estado interno cambia. Parece que cambie la clase del objeto.
 *
 *  Referencia: https://refactoring.guru/design-patterns/state
 *
 *  Ventajas:
 *  - Máquinas de estado simples y claras
 *  - Evita condicionales complejos
 *  - Fácil agregar nuevos estados
 *  - Comportamiento dependiente del estado
 */

import { isDirectRun, paso } from "./common.js";

// ── Estado (interfaz) ──────────────────────────────────────────
export interface Estado {
  nombre: string;
  iniciar(contexto: AgenteConEstado): Promise<void>;
  pausar(contexto: AgenteConEstado): Promise<void>;
  reanudar(contexto: AgenteConEstado): Promise<void>;
  cancelar(contexto: AgenteConEstado): Promise<void>;
  completar(contexto: AgenteConEstado): Promise<void>;
}

// ── Estados concretos ──────────────────────────────────────────
export class EstadoInicializado implements Estado {
  nombre = "Inicializado";

  async iniciar(contexto: AgenteConEstado): Promise<void> {
    console.log(`   🟢 ${contexto.nombre}: Iniciando...`);
    contexto.establecerEstado(new EstadoEjecutando());
  }

  async pausar(): Promise<void> {
    throw new Error("No puedes pausar si no estás ejecutando");
  }

  async reanudar(): Promise<void> {
    throw new Error("No puedes reanudar si no estabas pausado");
  }

  async cancelar(): Promise<void> {
    throw new Error("No puedes cancelar un agente no iniciado");
  }

  async completar(): Promise<void> {
    throw new Error("No puedes completar sin iniciar");
  }
}

export class EstadoEjecutando implements Estado {
  nombre = "Ejecutando";
  tiempoInicio = Date.now();

  async iniciar(): Promise<void> {
    throw new Error("Ya está ejecutando");
  }

  async pausar(contexto: AgenteConEstado): Promise<void> {
    console.log(`   ⏸️  ${contexto.nombre}: Pausado`);
    contexto.establecerEstado(new EstadoPausado());
  }

  async reanudar(): Promise<void> {
    throw new Error("Ya estás ejecutando");
  }

  async cancelar(contexto: AgenteConEstado): Promise<void> {
    console.log(`   ❌ ${contexto.nombre}: Cancelado`);
    contexto.establecerEstado(new EstadoCancelado());
  }

  async completar(contexto: AgenteConEstado): Promise<void> {
    const duracion = Date.now() - this.tiempoInicio;
    console.log(`   ✅ ${contexto.nombre}: Completado (${duracion}ms)`);
    contexto.establecerEstado(new EstadoCompletado());
  }
}

export class EstadoPausado implements Estado {
  nombre = "Pausado";

  async iniciar(): Promise<void> {
    throw new Error("Ya iniciaste antes");
  }

  async pausar(): Promise<void> {
    throw new Error("Ya está pausado");
  }

  async reanudar(contexto: AgenteConEstado): Promise<void> {
    console.log(`   ▶️  ${contexto.nombre}: Reanudando...`);
    contexto.establecerEstado(new EstadoEjecutando());
  }

  async cancelar(contexto: AgenteConEstado): Promise<void> {
    console.log(`   ❌ ${contexto.nombre}: Cancelado desde pausa`);
    contexto.establecerEstado(new EstadoCancelado());
  }

  async completar(): Promise<void> {
    throw new Error("No puedes completar desde pausa");
  }
}

export class EstadoCompletado implements Estado {
  nombre = "Completado";

  async iniciar(contexto: AgenteConEstado): Promise<void> {
    console.log(`   🔄 ${contexto.nombre}: Reiniciando...`);
    contexto.establecerEstado(new EstadoInicializado());
  }

  async pausar(): Promise<void> {
    throw new Error("No puedes pausar algo completado");
  }

  async reanudar(): Promise<void> {
    throw new Error("Ya está completado");
  }

  async cancelar(): Promise<void> {
    throw new Error("Ya está completado");
  }

  async completar(): Promise<void> {
    throw new Error("Ya está completado");
  }
}

export class EstadoCancelado implements Estado {
  nombre = "Cancelado";

  async iniciar(contexto: AgenteConEstado): Promise<void> {
    console.log(`   🔄 ${contexto.nombre}: Reiniciando tras cancelación...`);
    contexto.establecerEstado(new EstadoInicializado());
  }

  async pausar(): Promise<void> {
    throw new Error("No puedes pausar algo cancelado");
  }

  async reanudar(): Promise<void> {
    throw new Error("No puedes reanudar algo cancelado");
  }

  async cancelar(): Promise<void> {
    throw new Error("Ya está cancelado");
  }

  async completar(): Promise<void> {
    throw new Error("No puedes completar algo cancelado");
  }
}

// ── CONTEXTO: Agente con máquina de estados ───────────────────
export class AgenteConEstado {
  nombre: string;
  private estado: Estado;

  constructor(nombre: string) {
    this.nombre = nombre;
    this.estado = new EstadoInicializado();
  }

  establecerEstado(nuevoEstado: Estado): void {
    this.estado = nuevoEstado;
  }

  obtenerEstado(): string {
    return this.estado.nombre;
  }

  async iniciar(): Promise<void> {
    await this.estado.iniciar(this);
  }

  async pausar(): Promise<void> {
    await this.estado.pausar(this);
  }

  async reanudar(): Promise<void> {
    await this.estado.reanudar(this);
  }

  async cancelar(): Promise<void> {
    await this.estado.cancelar(this);
  }

  async completar(): Promise<void> {
    await this.estado.completar(this);
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export async function demostrarState(): Promise<void> {
  paso("🎛️", "Demostrando State Pattern");

  paso("1️⃣", "Flujo normal de ejecución");

  const agente = new AgenteConEstado("Agente-1");
  console.log(`   Estado inicial: ${agente.obtenerEstado()}\n`);

  await agente.iniciar();
  console.log(`   → ${agente.obtenerEstado()}\n`);

  await agente.pausar();
  console.log(`   → ${agente.obtenerEstado()}\n`);

  await agente.reanudar();
  console.log(`   → ${agente.obtenerEstado()}\n`);

  await agente.completar();
  console.log(`   → ${agente.obtenerEstado()}\n`);

  paso("2️⃣", "Flujo con cancelación");

  const agente2 = new AgenteConEstado("Agente-2");

  await agente2.iniciar();
  console.log(`   → ${agente2.obtenerEstado()}\n`);

  await agente2.cancelar();
  console.log(`   → ${agente2.obtenerEstado()}\n`);

  paso("3️⃣", "Acciones inválidas (controladas por estado)");

  try {
    await agente.pausar();
  } catch (error) {
    console.log(`   ⚠️  ${error}`);
  }

  paso("✅", "Máquina de estados funcionando correctamente");
}

async function main(): Promise<void> {
  await demostrarState();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
