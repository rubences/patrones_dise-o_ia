/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 14 — CHAIN OF RESPONSIBILITY (BEHAVIORAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Solicitud]
 *       │
 *       ▼
 *  [Manejador 1] ──¿Puedo manejar? ──▶ NO ──▶ [Manejador 2]
 *       (Nivel 1)                                  (Nivel 2)
 *                                                      │
 *                                                      ▼
 *                                    ¿Puedo manejar? ──▶ NO ──▶ [Manejador 3]
 *                                                              (Nivel 3)
 *                                                                  │
 *                                                                  ▼
 *                                                    ¿Puedo manejar? ──▶ SÍ ──▶ ✅
 *
 *  Idea: Pasar una solicitud a través de una cadena de manejadores.
 *  Cada manejador decide si procesarla o pasarla al siguiente.
 *
 *  Referencia: https://refactoring.guru/design-patterns/chain-of-responsibility
 *
 *  Ventajas:
 *  - Desacoplamiento entre emisor y receptores
 *  - Orden flexible de manejadores
 *  - Fácil agregar/remover manejadores
 *  - Encadenamiento dinámico en runtime
 *
 *  Casos de uso:
 *  - Enrutamiento de solicitudes de soporte
 *  - Escalamiento progresivo de problemas
 *  - Validación en múltiples niveles
 *  - Autorización jerárquica
 *  - Procesamiento condicional
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── Tipos ──────────────────────────────────────────────────────
export interface Solicitud {
  contenido: string;
  prioridad: "baja" | "media" | "alta" | "crítica";
  campo: string; // Área: soporte, técnica, facturación, legal
  intentos: number;
}

export interface Respuesta {
  manejador: string;
  procesada: boolean;
  resultado?: string;
  escalada?: boolean;
  motivoEscalada?: string;
}

// ── Interfaz base para manejadores ────────────────────────────
export abstract class ManejadorSolicitud {
  protected siguiente?: ManejadorSolicitud;

  establecerSiguiente(siguiente: ManejadorSolicitud): ManejadorSolicitud {
    this.siguiente = siguiente;
    return siguiente;
  }

  async manejar(solicitud: Solicitud): Promise<Respuesta> {
    if (this.puedoManejar(solicitud)) {
      return this.procesar(solicitud);
    }

    if (this.siguiente) {
      console.log(
        `   ↓ ${this.constructor.name} no puede manejar, pasando al siguiente...`,
      );
      return this.siguiente.manejar(solicitud);
    }

    return {
      manejador: this.constructor.name,
      procesada: false,
      escalada: true,
      motivoEscalada: "Nadie en la cadena pudo manejar la solicitud",
    };
  }

  protected abstract puedoManejar(solicitud: Solicitud): boolean;

  protected abstract procesar(solicitud: Solicitud): Promise<Respuesta>;
}

// ── MANEJADOR 1: Soporte de Primer Nivel ──────────────────────
export class ManejadorSoporteNivel1 extends ManejadorSolicitud {
  protected puedoManejar(solicitud: Solicitud): boolean {
    // Maneja problemas simples y de baja prioridad
    return (
      solicitud.campo === "soporte" &&
      (solicitud.prioridad === "baja" || solicitud.prioridad === "media")
    );
  }

  protected async procesar(solicitud: Solicitud): Promise<Respuesta> {
    console.log(`   🆘 ManejadorSoporteNivel1: Procesando solicitud...`);

    return {
      manejador: "Soporte Nivel 1",
      procesada: true,
      resultado:
        "Problema resuelto con FAQ y documentación estándar. " +
        "Si la solicitud requiere más ayuda, será escalada.",
    };
  }
}

// ── MANEJADOR 2: Soporte Técnico ──────────────────────────────
export class ManejadorSoporteTecnico extends ManejadorSolicitud {
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    super();
    this.client = client;
  }

  protected puedoManejar(solicitud: Solicitud): boolean {
    // Maneja problemas técnicos de media y alta prioridad
    return (
      solicitud.campo === "soporte" &&
      (solicitud.prioridad === "media" || solicitud.prioridad === "alta")
    );
  }

  protected async procesar(solicitud: Solicitud): Promise<Respuesta> {
    console.log(`   🔧 ManejadorSoporteTecnico: Analizando problema...`);

    // Usar IA para diagnosticar
    const diagnostico = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions:
        "Eres un técnico experto. Proporciona diagnóstico breve del problema " +
        "y pasos de solución concretos.",
      input: `Problema reportado: ${solicitud.contenido}`,
    });

    return {
      manejador: "Soporte Técnico",
      procesada: true,
      resultado: diagnostico.output_text,
    };
  }
}

// ── MANEJADOR 3: Facturación ───────────────────────────────────
export class ManejadorFacturacion extends ManejadorSolicitud {
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    super();
    this.client = client;
  }

  protected puedoManejar(solicitud: Solicitud): boolean {
    // Maneja solicitudes de facturación
    return solicitud.campo === "facturación";
  }

  protected async procesar(solicitud: Solicitud): Promise<Respuesta> {
    console.log(
      `   💰 ManejadorFacturacion: Revisando solicitud de facturación...`,
    );

    const analisis = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions:
        "Eres un especialista en facturación. Resuelve la solicitud de forma clara.",
      input: `Solicitud: ${solicitud.contenido}`,
    });

    return {
      manejador: "Facturación",
      procesada: true,
      resultado: analisis.output_text,
    };
  }
}

// ── MANEJADOR 4: Legal (solo problemas críticos) ───────────────
export class ManejadorLegal extends ManejadorSolicitud {
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    super();
    this.client = client;
  }

  protected puedoManejar(solicitud: Solicitud): boolean {
    // Maneja solo solicitudes críticas de naturaleza legal
    return (
      solicitud.campo === "legal" ||
      (solicitud.prioridad === "crítica" && solicitud.campo === "soporte")
    );
  }

  protected async procesar(solicitud: Solicitud): Promise<Respuesta> {
    console.log(`   ⚖️  ManejadorLegal: Analizando asunto legal...`);

    const parecer = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions:
        "Proporciona un análisis legal preliminar. Sé cauteloso y " +
        "recomienda escalación a abogado si es complejo.",
      input: `Asunto: ${solicitud.contenido}`,
    });

    return {
      manejador: "Legal",
      procesada: true,
      resultado: parecer.output_text,
    };
  }
}

// ── MANEJADOR 5: Supervisión (última instancia) ────────────────
export class ManejadorSupervisor extends ManejadorSolicitud {
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    super();
    this.client = client;
  }

  protected puedoManejar(): boolean {
    // Siempre puede intentar manejar (última instancia)
    return true;
  }

  protected async procesar(solicitud: Solicitud): Promise<Respuesta> {
    console.log(`   👤 ManejadorSupervisor: Revisión de supervisor...`);

    const decision = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "medium" },
      store: false,
      instructions:
        "Eres un supervisor experimentado. Analiza la solicitud y proporciona " +
        "una decisión o recomendación de escalación a humano.",
      input: `Solicitud no resuelta por otros manejadores (intento ${solicitud.intentos}):\n${solicitud.contenido}`,
    });

    return {
      manejador: "Supervisor",
      procesada: true,
      resultado: decision.output_text,
    };
  }
}

// ── Constructor de cadena ──────────────────────────────────────
export class CadenaSoporteFactory {
  static crearCadenaEstandar(client: OpenAI = makeClient()): ManejadorSolicitud {
    const nivel1 = new ManejadorSoporteNivel1();
    const tecnico = new ManejadorSoporteTecnico(client);
    const facturacion = new ManejadorFacturacion(client);
    const legal = new ManejadorLegal(client);
    const supervisor = new ManejadorSupervisor(client);

    // Armar la cadena
    nivel1.establecerSiguiente(tecnico);
    tecnico.establecerSiguiente(facturacion);
    facturacion.establecerSiguiente(legal);
    legal.establecerSiguiente(supervisor);

    return nivel1;
  }
}

// ── Ejemplo de uso ─────────────────────────────────────────────
export async function demostrarChainOfResponsibility(
  client: OpenAI = makeClient(),
): Promise<void> {
  paso("⛓️", "Demostrando Chain of Responsibility Pattern");

  // Crear cadena de manejadores
  const cadena = CadenaSoporteFactory.crearCadenaEstandar(client);

  const solicitudes: Solicitud[] = [
    {
      contenido: "¿Cómo cambio mi contraseña?",
      prioridad: "baja",
      campo: "soporte",
      intentos: 1,
    },
    {
      contenido:
        "El sistema devuelve error 500 al procesar pagos. Muy urgente.",
      prioridad: "alta",
      campo: "soporte",
      intentos: 1,
    },
    {
      contenido: "Necesito una factura corregida del mes pasado",
      prioridad: "media",
      campo: "facturación",
      intentos: 1,
    },
    {
      contenido: "Necesito revisar términos de contrato y privacidad",
      prioridad: "crítica",
      campo: "legal",
      intentos: 1,
    },
  ];

  paso("📋", "Procesando solicitudes...");

  for (let i = 0; i < solicitudes.length; i++) {
    const solicitud = solicitudes[i];

    paso(
      `${i + 1}️⃣`,
      `Solicitud: ${solicitud.contenido.slice(0, 50)}... (${solicitud.prioridad})`,
    );

    try {
      const respuesta = await cadena.manejar(solicitud);

      if (respuesta.procesada) {
        console.log(`   ✅ Manejador: ${respuesta.manejador}`);
        console.log(`   Resultado: ${respuesta.resultado?.slice(0, 80)}…`);
      } else if (respuesta.escalada) {
        console.log(`   ⚠️  ESCALADA: ${respuesta.motivoEscalada}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }

    console.log();
  }

  paso("📊", "Resumen");
  console.log(
    `   Total solicitudes procesadas: ${solicitudes.length}`,
  );
}

async function main(): Promise<void> {
  await demostrarChainOfResponsibility();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
