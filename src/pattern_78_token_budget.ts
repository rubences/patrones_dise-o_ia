/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 78 — TOKEN BUDGET (PRESUPUESTO DE TOKENS)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Sesión de usuario]
 *  Presupuesto: 10.000 tokens
 *       │
 *  ┌────┴────────────────────┐
 *  │  Llamada 1: 1.200 tokens│ → Saldo: 8.800
 *  │  Llamada 2: 2.500 tokens│ → Saldo: 6.300
 *  │  Llamada 3: ??? tokens  │
 *  │                          │
 *  │  ¿Presupuesto suficiente?│
 *  │  SÍ → Ejecutar           │
 *  │  NO → Comprimir / Denegar│
 *  └──────────────────────────┘
 *
 *  Idea: Controlar el gasto de tokens por sesión, usuario o
 *  período, con degradación elegante cuando se acerca al límite.
 *
 *  Ventajas:
 *  - Control de costos en producción
 *  - Alertas ante uso excesivo
 *  - Degradación elegante (comprimir vs denegar)
 *  - Analítica de consumo por usuario/sesión
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface PresupuestoConfig {
  limite: number;
  alertaEn: number;     // % para alertar (ej. 0.8 = 80% usado)
  estrategiaSuperado: "denegar" | "comprimir" | "degradar";
}

export interface ConsumoRegistro {
  timestamp: Date;
  operacion: string;
  tokensEntrada: number;
  tokensSalida: number;
  total: number;
}

export class GestorTokenBudget {
  private config: PresupuestoConfig;
  private tokensUsados: number = 0;
  private historial: ConsumoRegistro[] = [];

  constructor(config: PresupuestoConfig) {
    this.config = config;
  }

  private estimarTokens(texto: string): number {
    return Math.ceil(texto.split(/\s+/).length * 1.3);
  }

  verificar(promptEstimado: string): {
    permitido: boolean;
    tokensDisponibles: number;
    porcentajeUsado: number;
    alerta: boolean;
  } {
    const tokensEstimados = this.estimarTokens(promptEstimado);
    const disponibles = this.config.limite - this.tokensUsados;
    const porcentaje = this.tokensUsados / this.config.limite;

    return {
      permitido: tokensEstimados <= disponibles,
      tokensDisponibles: disponibles,
      porcentajeUsado: Math.round(porcentaje * 100),
      alerta: porcentaje >= this.config.alertaEn,
    };
  }

  registrar(operacion: string, entrada: string, salida: string): ConsumoRegistro {
    const tokensEntrada = this.estimarTokens(entrada);
    const tokensSalida = this.estimarTokens(salida);
    const total = tokensEntrada + tokensSalida;

    this.tokensUsados += total;

    const registro: ConsumoRegistro = {
      timestamp: new Date(),
      operacion,
      tokensEntrada,
      tokensSalida,
      total,
    };

    this.historial.push(registro);
    return registro;
  }

  obtenerEstado(): {
    usado: number;
    disponible: number;
    limite: number;
    porcentaje: number;
    historial: ConsumoRegistro[];
  } {
    return {
      usado: this.tokensUsados,
      disponible: this.config.limite - this.tokensUsados,
      limite: this.config.limite,
      porcentaje: Math.round((this.tokensUsados / this.config.limite) * 100),
      historial: [...this.historial],
    };
  }

  reiniciar(): void {
    this.tokensUsados = 0;
    this.historial = [];
  }
}

export class AgenteConBudget {
  private budget: GestorTokenBudget;
  private client: OpenAI;

  constructor(limitTokens: number, client: OpenAI = makeClient()) {
    this.client = client;
    this.budget = new GestorTokenBudget({
      limite: limitTokens,
      alertaEn: 0.75,
      estrategiaSuperado: "comprimir",
    });
  }

  async responder(consulta: string): Promise<{ respuesta: string; estado: string }> {
    const verificacion = this.budget.verificar(consulta);

    if (verificacion.alerta) {
      console.log(`   ⚠️  Alerta: ${verificacion.porcentajeUsado}% del presupuesto usado`);
    }

    if (!verificacion.permitido) {
      console.log(`   🚫 Presupuesto agotado. Disponible: ${verificacion.tokensDisponibles} tokens`);
      return { respuesta: "Presupuesto de tokens agotado para esta sesión.", estado: "agotado" };
    }

    // Comprimir el prompt si queda poco presupuesto
    const promptFinal = verificacion.tokensDisponibles < 500
      ? `Responde en máximo 50 palabras: ${consulta}`
      : consulta;

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: verificacion.tokensDisponibles < 1000 ? "low" : "low" },
      store: false,
      instructions: promptFinal,
      input: "",
    });

    const registro = this.budget.registrar("llm-call", promptFinal, resp.output_text);
    console.log(`   💰 Consumo: ${registro.total} tokens | Total usado: ${this.budget.obtenerEstado().usado}/${this.budget.obtenerEstado().limite}`);

    return { respuesta: resp.output_text, estado: "ok" };
  }

  obtenerEstado() {
    return this.budget.obtenerEstado();
  }
}

export async function demostrarTokenBudget(client: OpenAI = makeClient()): Promise<void> {
  paso("💰", "Demostrando Token Budget Pattern");

  // Budget pequeño para demostrar el comportamiento
  const agente = new AgenteConBudget(3000, client);

  const preguntas = [
    "¿Qué es el patrón RAG?",
    "Explica los 5 principios SOLID",
    "¿Cuáles son las mejores prácticas para APIs REST?",
    "¿Qué diferencia hay entre proceso e hilo en sistemas operativos?",
  ];

  paso("1️⃣", "Consumo progresivo con alertas");
  for (const pregunta of preguntas) {
    console.log(`\n   📥 "${pregunta.slice(0, 50)}..."`);
    const { respuesta, estado } = await agente.responder(pregunta);
    if (estado === "agotado") break;
    console.log(`   📤 "${respuesta.slice(0, 60)}..."`);
  }

  paso("2️⃣", "Estado final del presupuesto");
  const estado = agente.obtenerEstado();
  console.log(`\n   Tokens usados: ${estado.usado}/${estado.limite} (${estado.porcentaje}%)`);
  console.log(`   Llamadas realizadas: ${estado.historial.length}`);

  const barra = "█".repeat(Math.floor(estado.porcentaje / 10)) + "░".repeat(10 - Math.floor(estado.porcentaje / 10));
  console.log(`   Presupuesto: [${barra}] ${estado.porcentaje}%`);

  paso("3️⃣", "Desglose por operación");
  estado.historial.forEach((r, i) => {
    console.log(`   ${i + 1}. ${r.operacion}: ${r.total} tokens (in:${r.tokensEntrada} + out:${r.tokensSalida})`);
  });

  paso("✅", "Token Budget controlando costos con degradación elegante");
}

async function main(): Promise<void> { await demostrarTokenBudget(); }
if (isDirectRun(import.meta.url)) { main().catch((e: unknown) => { console.error(e); process.exitCode = 1; }); }
