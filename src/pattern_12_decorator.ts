/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 12 — DECORATOR (PATRÓN ESTRUCTURAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Agente Base]
 *       │
 *       ├─ [Decorator: Logging] ──┐
 *       │                          │
 *       ├─ [Decorator: Retry] ────┤
 *       │                          ├──▶ [Agente Decorado]
 *       ├─ [Decorator: Cache] ────┤
 *       │                          │
 *       └─ [Decorator: Validation]─┘
 *
 *  Idea: Agregar comportamientos a objetos existentes dinámicamente,
 *  sin modificar su estructura. Permite composición flexible.
 *
 *  Referencia: https://refactoring.guru/design-patterns/decorator
 *
 *  Ventajas:
 *  - Agregar funcionalidad sin modificar el agente original
 *  - Composición flexible (puedo stacks múltiples decoradores)
 *  - Responsabilidad única (cada decorador hace una cosa)
 *  - Testeable (puedo testear cada decorador aisladamente)
 *
 *  Casos de uso:
 *  - Logging y monitoreo
 *  - Retry y circuit breaker
 *  - Cachéing
 *  - Validación de entrada/salida
 *  - Rate limiting
 *  - Fallback strategies
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── Interfaz base para agentes ─────────────────────────────────
export interface ComponenteAgente {
  procesar(entrada: string): Promise<string>;
  nombre: string;
}

// ── Agente concreto simple ─────────────────────────────────────
export class AgenteSimple implements ComponenteAgente {
  nombre: string;
  private client: OpenAI;

  constructor(nombre: string, client: OpenAI) {
    this.nombre = nombre;
    this.client = client;
  }

  async procesar(entrada: string): Promise<string> {
    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Eres ${this.nombre}. Responde brevemente.`,
      input: entrada,
    });

    return respuesta.output_text;
  }
}

// ── DECORADOR BASE ─────────────────────────────────────────────
export abstract class DecoradorAgente implements ComponenteAgente {
  protected agente: ComponenteAgente;

  constructor(agente: ComponenteAgente) {
    this.agente = agente;
  }

  get nombre(): string {
    return this.agente.nombre;
  }

  abstract procesar(entrada: string): Promise<string>;
}

// ── DECORADOR: Logging ─────────────────────────────────────────
export class DecoradorLogging extends DecoradorAgente {
  async procesar(entrada: string): Promise<string> {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 📝 Entrada: ${entrada.slice(0, 50)}…`);

    const inicio = Date.now();
    const resultado = await this.agente.procesar(entrada);
    const duracion = Date.now() - inicio;

    console.log(
      `[${timestamp}] ✅ Salida: ${resultado.slice(0, 50)}… (${duracion}ms)`,
    );

    return resultado;
  }
}

// ── DECORADOR: Retry ───────────────────────────────────────────
export class DecoradorRetry extends DecoradorAgente {
  private intentos: number;
  private delayMs: number;

  constructor(agente: ComponenteAgente, intentos = 3, delayMs = 1000) {
    super(agente);
    this.intentos = intentos;
    this.delayMs = delayMs;
  }

  async procesar(entrada: string): Promise<string> {
    let ultimoError: Error | null = null;

    for (let intento = 1; intento <= this.intentos; intento++) {
      try {
        console.log(`🔄 Intento ${intento}/${this.intentos}...`);
        return await this.agente.procesar(entrada);
      } catch (error) {
        ultimoError = error instanceof Error ? error : new Error(String(error));
        console.log(`   ❌ Falló: ${ultimoError.message}`);

        if (intento < this.intentos) {
          const delayActual = this.delayMs * intento;
          console.log(`   ⏳ Esperando ${delayActual}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delayActual));
        }
      }
    }

    throw ultimoError || new Error("Todos los intentos fallaron");
  }
}

// ── DECORADOR: Caché ───────────────────────────────────────────
export class DecoradorCache extends DecoradorAgente {
  private cache: Map<string, string> = new Map();

  async procesar(entrada: string): Promise<string> {
    // Clave del caché basada en entrada
    const clave = this.hashear(entrada);

    if (this.cache.has(clave)) {
      console.log(`💾 Cache HIT para entrada: ${entrada.slice(0, 40)}…`);
      return this.cache.get(clave)!;
    }

    console.log(`💾 Cache MISS para entrada: ${entrada.slice(0, 40)}…`);
    const resultado = await this.agente.procesar(entrada);
    this.cache.set(clave, resultado);

    return resultado;
  }

  private hashear(texto: string): string {
    return Buffer.from(texto).toString("base64").substring(0, 32);
  }

  limpiarCache(): void {
    this.cache.clear();
    console.log("🗑️  Caché limpiado");
  }

  estadisticas(): { entradas: number } {
    return { entradas: this.cache.size };
  }
}

// ── DECORADOR: Validación ─────────────────────────────────────
export class DecoradorValidacion extends DecoradorAgente {
  private longitudMinima: number;
  private longitudMaxima: number;

  constructor(
    agente: ComponenteAgente,
    longitudMinima = 5,
    longitudMaxima = 1000,
  ) {
    super(agente);
    this.longitudMinima = longitudMinima;
    this.longitudMaxima = longitudMaxima;
  }

  async procesar(entrada: string): Promise<string> {
    console.log(`🔍 Validando entrada...`);

    if (entrada.length < this.longitudMinima) {
      throw new Error(
        `Entrada muy corta. Mínimo: ${this.longitudMinima} caracteres`,
      );
    }

    if (entrada.length > this.longitudMaxima) {
      throw new Error(
        `Entrada muy larga. Máximo: ${this.longitudMaxima} caracteres`,
      );
    }

    const resultado = await this.agente.procesar(entrada);

    if (!resultado || resultado.trim().length === 0) {
      throw new Error("Respuesta vacía del agente");
    }

    console.log(`✅ Validación exitosa`);
    return resultado;
  }
}

// ── DECORADOR: Timeout ─────────────────────────────────────────
export class DecoradorTimeout extends DecoradorAgente {
  private timeoutMs: number;

  constructor(agente: ComponenteAgente, timeoutMs = 5000) {
    super(agente);
    this.timeoutMs = timeoutMs;
  }

  async procesar(entrada: string): Promise<string> {
    const promesaAgente = this.agente.procesar(entrada);

    const promesaTimeout = new Promise<string>((_, reject) => {
      setTimeout(
        () => reject(new Error(`Timeout después de ${this.timeoutMs}ms`)),
        this.timeoutMs,
      );
    });

    return Promise.race([promesaAgente, promesaTimeout]);
  }
}

// ── Ejemplo de uso ─────────────────────────────────────────────
export async function demostrarDecorator(
  client: OpenAI = makeClient(),
): Promise<void> {
  paso("🎁", "Demostrando Decorator Pattern");

  // Crear agente base
  const agenteBase = new AgenteSimple("Especialista en IA", client);

  paso("1️⃣", "Agente sin decoradores");
  console.log(`   Nombre: ${agenteBase.nombre}`);
  const respuesta1 = await agenteBase.procesar("¿Qué es IA?");
  console.log(`   Respuesta: ${respuesta1.slice(0, 80)}…`);

  paso("2️⃣", "Agente con decoradores simples");

  // Stack 1: Base + Logging + Validación
  let agenteDecorado: ComponenteAgente = new AgenteSimple(
    "Especialista",
    client,
  );
  agenteDecorado = new DecoradorValidacion(agenteDecorado, 5, 500);
  agenteDecorado = new DecoradorLogging(agenteDecorado);

  console.log(`\n   Procesando entrada con Logging + Validación...`);
  const respuesta2 = await agenteDecorado.procesar(
    "¿Cuál es el futuro de la IA?",
  );
  console.log(`   ✅ Completado`);

  paso("3️⃣", "Agente con caché");

  let agenteEnCache: ComponenteAgente = new AgenteSimple(
    "Especialista",
    client,
  );
  agenteEnCache = new DecoradorCache(agenteEnCache);
  agenteEnCache = new DecoradorLogging(agenteEnCache);

  console.log(`\n   Primera consulta...`);
  await agenteEnCache.procesar("¿Qué es machine learning?");

  console.log(`\n   Segunda consulta (idéntica, desde caché)...`);
  await agenteEnCache.procesar("¿Qué es machine learning?");

  console.log(`\n   Tercera consulta (diferente)...`);
  await agenteEnCache.procesar("¿Qué es deep learning?");

  paso("4️⃣", "Agente con manejo de errores y retry");

  let agenteResilient: ComponenteAgente = new AgenteSimple(
    "Especialista",
    client,
  );
  agenteResilient = new DecoradorRetry(agenteResilient, 2, 500);
  agenteResilient = new DecoradorTimeout(agenteResilient, 10000);

  try {
    console.log(`\n   Ejecutando con Retry + Timeout...`);
    await agenteResilient.procesar(
      "Pregunta que será reintentada si falla...",
    );
    console.log(`   ✅ Exitoso`);
  } catch (error) {
    console.log(`   ❌ Error final: ${error}`);
  }

  paso("5️⃣", "Composición compleja");

  // Stack máximo: Base + Validación + Caché + Logging + Retry
  let agenteSuperDecorado: ComponenteAgente = new AgenteSimple(
    "Especialista",
    client,
  );
  agenteSuperDecorado = new DecoradorValidacion(agenteSuperDecorado);
  agenteSuperDecorado = new DecoradorCache(agenteSuperDecorado);
  agenteSuperDecorado = new DecoradorRetry(agenteSuperDecorado, 2);
  agenteSuperDecorado = new DecoradorLogging(agenteSuperDecorado);

  console.log(
    `\n   Ejecutando agente con 5 decoradores en stack...`,
  );
  const respuestaFinal = await agenteSuperDecorado.procesar(
    "Pregunta final con todas las características",
  );
  console.log(`   ✅ Resultado: ${respuestaFinal.slice(0, 80)}…`);
}

async function main(): Promise<void> {
  await demostrarDecorator();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
