/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 95 — ESCALATION TO HUMAN / HANDOFF (ESCALADA A HUMANO)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Conversación con el agente]
 *       │
 *  ¿Categoría siempre-escala? / ¿Intentos fallidos > umbral? / ¿Usuario lo pide?
 *       │
 *      SÍ
 *       ▼
 *  [Paquete de handoff]
 *  ├─ Resumen de la conversación (no solo "el usuario está molesto")
 *  ├─ Qué se intentó y por qué falló
 *  ├─ Categoría y prioridad sugerida
 *  └─ Historial completo para que el humano no empiece de cero
 *       │
 *       ▼
 *  [Cola de un agente humano]
 *
 *  Idea: cuando el agente reconoce que no puede resolver el caso —ya
 *  sea por límite de intentos, por categoría sensible, o porque el
 *  usuario lo pide explícitamente— transfiere TODA la conversación a
 *  un humano con un resumen accionable, no solo un mensaje de "no
 *  puedo ayudarte".
 *
 *  Diferencia vs Patrón 8 (Human-in-Loop): Human-in-Loop aprueba UNA
 *  acción concreta y de riesgo ANTES de ejecutarla (el agente sigue
 *  operando después de la aprobación). Escalation to Human transfiere
 *  TODA la sesión — el agente deja de intervenir y un humano toma el
 *  control completo de la conversación.
 *
 *  Ventajas:
 *  - El humano recibe contexto completo, no una transcripción cruda
 *  - Criterios de escalada explícitos y auditables (no "se sintió mal")
 *  - Reduce fricción para el usuario: no repite lo ya dicho al agente
 *  - Categorías sensibles escalan siempre, sin depender de heurísticas
 */

import { isDirectRun, paso } from "./common.js";

export interface Turno {
  rol: "user" | "assistant";
  contenido: string;
}

export interface ContextoConversacion {
  turnos: Turno[];
  intentosFallidos: number;
  categoria?: string;
}

export interface DecisionEscalacion {
  escalar: boolean;
  razon?: string;
}

export interface PaqueteHandoff {
  resumen: string;
  queSeIntento: string[];
  categoria: string;
  prioridad: "baja" | "media" | "alta";
  historialCompleto: Turno[];
}

export class MotorEscalacion {
  constructor(
    private umbralIntentosFallidos: number,
    private categoriasQueEscalanSiempre: string[] = [],
  ) {}

  evaluar(contexto: ContextoConversacion, usuarioLoPide: boolean = false): DecisionEscalacion {
    if (usuarioLoPide) {
      return { escalar: true, razon: "El usuario solicitó hablar con una persona" };
    }
    if (contexto.categoria && this.categoriasQueEscalanSiempre.includes(contexto.categoria)) {
      return { escalar: true, razon: `Categoría "${contexto.categoria}" escala siempre por política` };
    }
    if (contexto.intentosFallidos >= this.umbralIntentosFallidos) {
      return { escalar: true, razon: `${contexto.intentosFallidos} intentos fallidos (umbral: ${this.umbralIntentosFallidos})` };
    }
    return { escalar: false };
  }

  construirPaqueteHandoff(contexto: ContextoConversacion, razonEscalada: string, intentosDescripcion: string[]): PaqueteHandoff {
    const ultimosTurnos = contexto.turnos.slice(-3).map((t) => `${t.rol}: ${t.contenido.slice(0, 60)}`).join(" | ");
    return {
      resumen: `Escalado: ${razonEscalada}. Últimos turnos: ${ultimosTurnos}`,
      queSeIntento: intentosDescripcion,
      categoria: contexto.categoria ?? "sin_categorizar",
      prioridad: contexto.intentosFallidos >= this.umbralIntentosFallidos + 2 ? "alta" : "media",
      historialCompleto: contexto.turnos,
    };
  }
}

export async function demostrarHumanEscalation(): Promise<void> {
  paso("🧑‍💼", "Demostrando Escalation to Human / Handoff Pattern");

  const motor = new MotorEscalacion(2, ["fraude", "cancelacion_legal"]);

  paso("1️⃣", "Categoría sensible: escala inmediatamente, sin agotar intentos");
  const contextoFraude: ContextoConversacion = {
    turnos: [{ rol: "user", contenido: "Veo un cargo que no reconozco en mi cuenta" }],
    intentosFallidos: 0,
    categoria: "fraude",
  };
  const decision1 = motor.evaluar(contextoFraude);
  console.log(`   Escalar: ${decision1.escalar} — ${decision1.razon}`);

  paso("2️⃣", "Intentos fallidos agotados: el agente reconoce que no puede resolverlo");
  const contextoFallido: ContextoConversacion = {
    turnos: [
      { rol: "user", contenido: "Mi integración con la API devuelve error 500" },
      { rol: "assistant", contenido: "Prueba a regenerar tu API key" },
      { rol: "user", contenido: "Ya lo hice, sigue fallando" },
      { rol: "assistant", contenido: "Revisa que el endpoint sea correcto" },
      { rol: "user", contenido: "El endpoint es correcto, sigue el error 500" },
    ],
    intentosFallidos: 2,
    categoria: "soporte_tecnico",
  };
  const decision2 = motor.evaluar(contextoFallido);
  console.log(`   Escalar: ${decision2.escalar} — ${decision2.razon}`);

  if (decision2.escalar && decision2.razon) {
    const paquete = motor.construirPaqueteHandoff(contextoFallido, decision2.razon, [
      "Sugerir regenerar API key — no resolvió",
      "Sugerir revisar endpoint — no resolvió",
    ]);
    paso("3️⃣", "Paquete de handoff — el humano no empieza de cero");
    console.log(`   Resumen: ${paquete.resumen}`);
    console.log(`   Qué se intentó: ${paquete.queSeIntento.join("; ")}`);
    console.log(`   Categoría: ${paquete.categoria} | Prioridad: ${paquete.prioridad}`);
  }

  paso("4️⃣", "Caso normal: no escala, el agente sigue atendiendo");
  const contextoNormal: ContextoConversacion = { turnos: [], intentosFallidos: 0, categoria: "consulta_general" };
  const decision3 = motor.evaluar(contextoNormal);
  console.log(`   Escalar: ${decision3.escalar}`);

  paso("✅", "Escalation to Human transfiriendo contexto completo, no solo la conversación cruda");
}

async function main(): Promise<void> {
  await demostrarHumanEscalation();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
