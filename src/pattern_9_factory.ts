/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 9 — FACTORY (PATRÓN DE CREACIÓN)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Cliente] ──┐
 *              │
 *              ▼
 *         [AgentFactory]
 *              │
 *    ┌─────────┼─────────┐
 *    │         │         │
 *    ▼         ▼         ▼
 *  [Expert] [Generalist] [Supervisor]
 *
 *  Idea: Encapsular la creación de agentes especializados
 *  detrás de una interfaz común. El cliente no necesita conocer
 *  la implementación específica de cada agente.
 *
 *  Referencia: https://refactoring.guru/design-patterns/factory-method
 *
 *  Ventajas:
 *  - Desacoplamiento entre cliente y agentes concretos
 *  - Fácil agregar nuevos tipos de agentes
 *  - Lógica de creación centralizada
 *  - Facilita testing (mocks de agentes)
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── Interfaz común para todos los agentes ──────────────────────
export interface Agente {
  tipo: "experto" | "generalista" | "supervisor" | "auditor";
  nombre: string;
  instruccion: string;
  especializacion?: string;
  procesarTarea(tarea: string, client: OpenAI): Promise<string>;
}

// ── Implementaciones concretas ─────────────────────────────────
class AgenteExperto implements Agente {
  tipo: "experto" = "experto";
  nombre: string;
  especializacion: string;
  instruccion: string;

  constructor(especializacion: string) {
    this.especializacion = especializacion;
    this.nombre = `Experto en ${especializacion}`;
    this.instruccion = `Eres un experto en ${especializacion}. ` +
      `Proporciona análisis profundo, referencias a mejores prácticas, ` +
      `y soluciones especializadas. Sé preciso y técnico.`;
  }

  async procesarTarea(tarea: string, client: OpenAI): Promise<string> {
    const respuesta = await client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions: this.instruccion,
      input: tarea,
    });

    return respuesta.output_text;
  }
}

class AgenteGeneralista implements Agente {
  tipo: "generalista" = "generalista";
  nombre = "Agente Generalista";
  instruccion = "Eres un asistente versátil y amable. Responde con claridad, " +
    "accesibilidad y equilibrio entre precisión y practicidad.";

  async procesarTarea(tarea: string, client: OpenAI): Promise<string> {
    const respuesta = await client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: this.instruccion,
      input: tarea,
    });

    return respuesta.output_text;
  }
}

class AgenteSupervisor implements Agente {
  tipo: "supervisor" = "supervisor";
  nombre = "Supervisor";
  instruccion = "Eres un supervisor experimentado. Tu rol es revisar, " +
    "evaluar calidad, identificar riesgos y asegurar conformidad " +
    "con estándares y mejores prácticas.";

  async procesarTarea(tarea: string, client: OpenAI): Promise<string> {
    const respuesta = await client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions: this.instruccion,
      input: tarea,
    });

    return respuesta.output_text;
  }
}

class AgenteAuditor implements Agente {
  tipo: "auditor" = "auditor";
  nombre = "Auditor";
  instruccion = "Eres un auditor riguroso. Tu tarea es examinar, verificar, " +
    "cuestionar supuestos y buscar inconsistencias o vulnerabilidades. " +
    "Reporta hallazgos de forma clara y accionable.";

  async procesarTarea(tarea: string, client: OpenAI): Promise<string> {
    const respuesta = await client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions: this.instruccion,
      input: tarea,
    });

    return respuesta.output_text;
  }
}

// ── FACTORY: El creador centralizado ──────────────────────────
export interface ConfigAgente {
  tipo: "experto" | "generalista" | "supervisor" | "auditor";
  especializacion?: string;
}

export class FabricaAgentes {
  static crearAgente(config: ConfigAgente): Agente {
    switch (config.tipo) {
      case "experto":
        if (!config.especializacion) {
          throw new Error("Especializacion requerida para experto");
        }
        return new AgenteExperto(config.especializacion);

      case "generalista":
        return new AgenteGeneralista();

      case "supervisor":
        return new AgenteSupervisor();

      case "auditor":
        return new AgenteAuditor();

      default:
        throw new Error(`Tipo de agente desconocido: ${config.tipo}`);
    }
  }

  // Crear múltiples agentes de una vez
  static crearEquipo(configuraciones: ConfigAgente[]): Agente[] {
    return configuraciones.map((config) => this.crearAgente(config));
  }
}

// ── Ejemplo de uso ─────────────────────────────────────────────
export async function demostrarFactory(
  client: OpenAI = makeClient(),
): Promise<void> {
  const tarea =
    "¿Cuál es la mejor arquitectura para un sistema de recomendaciones?";

  paso("🏭", "Demostrando Factory Pattern");

  // Usar factory para crear agentes bajo demanda
  const especialista = FabricaAgentes.crearAgente({
    tipo: "experto",
    especializacion: "Arquitectura de Sistemas",
  });

  const generalista = FabricaAgentes.crearAgente({
    tipo: "generalista",
  });

  const auditor = FabricaAgentes.crearAgente({
    tipo: "auditor",
  });

  console.log(`\n📋 Tarea: ${tarea}`);

  paso("1️⃣", `${especialista.nombre}`);
  const respuestaEspecialista = await especialista.procesarTarea(
    tarea,
    client,
  );
  console.log(`   ${respuestaEspecialista.slice(0, 120)}…`);

  paso("2️⃣", `${generalista.nombre}`);
  const respuestaGeneralista = await generalista.procesarTarea(
    tarea,
    client,
  );
  console.log(`   ${respuestaGeneralista.slice(0, 120)}…`);

  paso("3️⃣", `${auditor.nombre}`);
  const respuestaAuditor = await auditor.procesarTarea(tarea, client);
  console.log(`   ${respuestaAuditor.slice(0, 120)}…`);

  // Crear un equipo completo de una vez
  paso("👥", "Crear equipo completo con factory");
  const equipo = FabricaAgentes.crearEquipo([
    { tipo: "experto", especializacion: "DevOps" },
    { tipo: "experto", especializacion: "Seguridad" },
    { tipo: "supervisor" },
  ]);

  console.log(`   Equipo creado: ${equipo.map((a) => a.nombre).join(", ")}`);
}

async function main(): Promise<void> {
  await demostrarFactory();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
