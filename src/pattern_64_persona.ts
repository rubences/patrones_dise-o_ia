/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 64 — PERSONA (PERSONALIDAD CONSISTENTE)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Consulta]
 *       │
 *       ▼
 *  [Sistema de Persona]
 *  ├─ Nombre: "Aria"
 *  ├─ Personalidad: amigable, curiosa
 *  ├─ Expertise: patrones de diseño
 *  ├─ Tono: informal pero preciso
 *  └─ Limitaciones: no habla de política
 *
 *       │
 *       ▼
 *  [LLM con Persona activa]
 *       │
 *       ▼
 *  [Respuesta en personaje]
 *
 *  Idea: Mantener una identidad y personalidad consistente
 *  a través de todas las interacciones del agente.
 *
 *  Ventajas:
 *  - Experiencia de usuario más natural
 *  - Respuestas coherentes en tono y estilo
 *  - Fácil crear múltiples personas para distintos contextos
 *  - Controlable: evitar ciertos temas o comportamientos
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface Persona {
  nombre: string;
  descripcion: string;
  personalidad: string[];
  expertise: string[];
  tono: string;
  limitaciones: string[];
  frasesCaracteristicas: string[];
}

export class AgenteConPersona {
  private persona: Persona;
  private client: OpenAI;
  private historialConversacion: { rol: string; contenido: string }[] = [];

  constructor(persona: Persona, client: OpenAI = makeClient()) {
    this.persona = persona;
    this.client = client;
  }

  private construirSystemPrompt(): string {
    return `Eres ${this.persona.nombre}. ${this.persona.descripcion}

PERSONALIDAD: ${this.persona.personalidad.join(", ")}
EXPERTISE: ${this.persona.expertise.join(", ")}
TONO: ${this.persona.tono}
${this.persona.limitaciones.length ? `LIMITACIONES: ${this.persona.limitaciones.join(", ")}` : ""}
${this.persona.frasesCaracteristicas.length ? `FRASES CARACTERÍSTICAS (úsalas ocasionalmente): ${this.persona.frasesCaracteristicas.join(" | ")}` : ""}

Mantén siempre este personaje de forma consistente en todas tus respuestas.`;
  }

  async responder(mensaje: string): Promise<string> {
    this.historialConversacion.push({ rol: "usuario", contenido: mensaje });

    const contexto = this.historialConversacion
      .slice(-4) // Últimos 4 turnos
      .map((h) => `${h.rol === "usuario" ? "Usuario" : this.persona.nombre}: ${h.contenido}`)
      .join("\n");

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `${this.construirSystemPrompt()}

Conversación reciente:
${contexto}

Responde como ${this.persona.nombre} al último mensaje del usuario.`,
      input: "",
    });

    const respuesta = resp.output_text;
    this.historialConversacion.push({ rol: "asistente", contenido: respuesta });
    return respuesta;
  }

  cambiarPersona(nuevaPersona: Persona): void {
    this.persona = nuevaPersona;
    this.historialConversacion = [];
    console.log(`   🎭 Persona cambiada a: ${nuevaPersona.nombre}`);
  }
}

// Personas predefinidas
export const PERSONAS = {
  profesorPatrones: {
    nombre: "Prof. Ada",
    descripcion: "Profesora experta en patrones de diseño con 20 años de experiencia.",
    personalidad: ["pedagógica", "paciente", "detallista"],
    expertise: ["Gang of Four", "patrones agénticos", "arquitectura de software"],
    tono: "académico pero accesible, usa analogías y ejemplos",
    limitaciones: ["No da respuestas sin explicar el razonamiento"],
    frasesCaracteristicas: ["Excelente pregunta!", "Como veremos en el ejemplo...", "Recuerda siempre..."],
  } as Persona,

  asistenteTecnico: {
    nombre: "Dev",
    descripcion: "Asistente técnico especializado en desarrollo con IA.",
    personalidad: ["directo", "eficiente", "pragmático"],
    expertise: ["TypeScript", "OpenAI API", "arquitecturas de IA"],
    tono: "conciso y técnico, incluye código cuando ayuda",
    limitaciones: ["Responde en máximo 3 oraciones salvo que pidan más detalle"],
    frasesCaracteristicas: ["Aquí tienes:", "En código:", "La solución directa es:"],
  } as Persona,
};

export async function demostrarPersona(client: OpenAI = makeClient()): Promise<void> {
  paso("🎭", "Demostrando Persona Pattern");

  paso("1️⃣", "Persona: Profesora pedagógica");
  const prof = new AgenteConPersona(PERSONAS.profesorPatrones, client);
  const r1 = await prof.responder("¿Cuándo debo usar Factory Method?");
  console.log(`\n   Prof. Ada: "${r1.slice(0, 200)}..."\n`);

  paso("2️⃣", "Persona: Asistente técnico directo");
  const dev = new AgenteConPersona(PERSONAS.asistenteTecnico, client);
  const r2 = await dev.responder("¿Cuándo debo usar Factory Method?");
  console.log(`\n   Dev: "${r2.slice(0, 200)}..."\n`);

  paso("3️⃣", "Consistencia de persona (segunda pregunta)");
  const r3 = await prof.responder("¿Y cuál es la diferencia con Abstract Factory?");
  console.log(`\n   Prof. Ada (turno 2): "${r3.slice(0, 150)}..."\n`);

  paso("✅", "Persona manteniendo identidad consistente a través de la conversación");
}

async function main(): Promise<void> { await demostrarPersona(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
