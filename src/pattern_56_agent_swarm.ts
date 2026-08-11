/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 56 — AGENT SWARM (ENJAMBRE DE AGENTES)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Sin coordinación central:
 *  [A1]↔[A2]↔[A3]↔[A4] ... ← Todos se comunican entre sí
 *
 *  Swarm (auto-organizado):
 *  [A1]──▶[A2]  [A3]──▶[A4]
 *    ↖          ↗
 *       [Estado compartido]
 *
 *  Cada agente:
 *  1. Lee el estado compartido (pizarrón)
 *  2. Contribuye si puede añadir valor
 *  3. Actualiza el estado
 *  4. Pasa el turno
 *
 *  Idea: Múltiples agentes coordinados mediante estado compartido
 *  sin coordinador central. Comportamiento emergente.
 *
 *  Diferencia vs Multi-Agent: Multi-Agent tiene orquestador central;
 *  Swarm tiene coordinación distribuida mediante pizarrón.
 *
 *  Ventajas:
 *  - Sin punto único de fallo
 *  - Comportamiento emergente
 *  - Escala naturalmente
 *  - Especialización dinámica
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface EstadoPizarron {
  problema: string;
  contribuciones: { agente: string; contenido: string; timestamp: Date }[];
  resuelto: boolean;
  iteracion: number;
}

export class AgenteSwarm {
  private nombre: string;
  private especialidad: string;
  private client: OpenAI;

  constructor(nombre: string, especialidad: string, client: OpenAI) {
    this.nombre = nombre;
    this.especialidad = especialidad;
    this.client = client;
  }

  async contribuir(pizarron: EstadoPizarron): Promise<string | null> {
    // Verificar si este agente puede añadir valor con su especialidad
    const contribucionesActuales = pizarron.contribuciones
      .map((c) => `[${c.agente}]: ${c.contenido}`)
      .join("\n");

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Eres ${this.nombre}, especialista en ${this.especialidad}.
      
Problema: ${pizarron.problema}

Contribuciones previas:
${contribucionesActuales || "(Ninguna aún)"}

¿Puedes añadir algo valioso desde tu especialidad que AÚN NO se haya dicho?
Si no puedes añadir nada nuevo, responde solo: PASA
Si puedes contribuir, responde con tu aportación en 1-2 oraciones.`,
      input: "",
    });

    const contenido = resp.output_text.trim();
    if (contenido.toUpperCase() === "PASA" || contenido.length < 10) {
      return null;
    }

    return contenido;
  }
}

export class SwarmCoordinador {
  private agentes: AgenteSwarm[];

  constructor(client: OpenAI = makeClient()) {
    this.agentes = [
      new AgenteSwarm("Experto-Arquitectura", "arquitectura de sistemas", client),
      new AgenteSwarm("Experto-Seguridad", "ciberseguridad y privacidad", client),
      new AgenteSwarm("Experto-Performance", "optimización y rendimiento", client),
      new AgenteSwarm("Experto-UX", "experiencia de usuario", client),
    ];
  }

  async resolver(problema: string, maxIteraciones = 3): Promise<EstadoPizarron> {
    console.log(`\n   🐝 Swarm activado: "${problema.slice(0, 50)}..."`);

    const pizarron: EstadoPizarron = {
      problema,
      contribuciones: [],
      resuelto: false,
      iteracion: 0,
    };

    for (let iter = 0; iter < maxIteraciones; iter++) {
      pizarron.iteracion = iter + 1;
      console.log(`\n   ── Iteración ${iter + 1} ──`);
      let nuevasContribuciones = 0;

      for (const agente of this.agentes) {
        const contribucion = await agente.contribuir(pizarron);
        if (contribucion) {
          pizarron.contribuciones.push({
            agente: agente["nombre"],
            contenido: contribucion,
            timestamp: new Date(),
          });
          console.log(`   ✓ ${agente["nombre"]}: "${contribucion.slice(0, 70)}..."`);
          nuevasContribuciones++;
        } else {
          console.log(`   ⏭  ${agente["nombre"]}: PASA`);
        }
      }

      if (nuevasContribuciones === 0) {
        console.log(`\n   ✅ Consenso alcanzado (sin nuevas contribuciones)`);
        pizarron.resuelto = true;
        break;
      }
    }

    return pizarron;
  }
}

export async function demostrarAgentSwarm(client: OpenAI = makeClient()): Promise<void> {
  paso("🐝", "Demostrando Agent Swarm Pattern");

  const swarm = new SwarmCoordinador(client);

  paso("1️⃣", "Resolver problema mediante coordinación emergente");
  const resultado = await swarm.resolver(
    "Diseñar una arquitectura para un sistema de IA con alta disponibilidad y seguridad",
    2,
  );

  console.log(`\n   Iteraciones: ${resultado.iteracion}`);
  console.log(`   Contribuciones totales: ${resultado.contribuciones.length}`);
  console.log(`   Resuelto por consenso: ${resultado.resuelto}`);

  paso("2️⃣", "Resumen de contribuciones del enjambre");
  resultado.contribuciones.forEach((c) => {
    console.log(`\n   [${c.agente}]`);
    console.log(`   "${c.contenido.slice(0, 100)}..."`);
  });

  paso("✅", "Swarm coordinando múltiples agentes sin orquestador central");
}

async function main(): Promise<void> { await demostrarAgentSwarm(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
