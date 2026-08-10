/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 21 — PROXY (STRUCTURAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Cliente]
 *       │
 *       ▼
 *  [Proxy: Control de Acceso]
 *       │
 *       ├─ ¿Autorizado? ──▶ NO ──▶ Rechazar
 *       │
 *       ├─ ¿Rate limit? ──▶ NO ──▶ Permitir
 *       │
 *       └─ ✅ Delegara
 *            │
 *            ▼
 *       [Agente Real]
 *
 *  Idea: Proporcionar un sustituto o marcador de posición para
 *  otro objeto para controlar el acceso a él.
 *
 *  Referencia: https://refactoring.guru/design-patterns/proxy
 *
 *  Ventajas:
 *  - Control de acceso (autorización)
 *  - Rate limiting
 *  - Logging
 *  - Lazy loading (carga perezosa)
 *  - Caching
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── Interfaz común ─────────────────────────────────────────────
export interface AgenteAPI {
  procesar(entrada: string): Promise<string>;
  obtenerNombre(): string;
}

// ── SUJETO REAL: Agente sin protección ─────────────────────────
export class AgenteReal implements AgenteAPI {
  private nombre: string;
  private client: OpenAI;

  constructor(nombre: string, client: OpenAI = makeClient()) {
    this.nombre = nombre;
    this.client = client;
  }

  async procesar(entrada: string): Promise<string> {
    console.log(`      🤖 [Real] Procesando: ${entrada.slice(0, 30)}...`);

    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Responde brevemente: ${entrada}`,
      input: "",
    });

    return respuesta.output_text;
  }

  obtenerNombre(): string {
    return this.nombre;
  }
}

// ── PROXY: Control de acceso y rate limiting ────────────────────
export class ProxyAgenteControlado implements AgenteAPI {
  private agenteReal: AgenteReal;
  private usuariosAutorizados: Set<string>;
  private rateLimitPorUsuario: Map<string, number> = new Map();
  private maxLlamadasPorMinuto: number;

  constructor(
    agenteReal: AgenteReal,
    usuariosAutorizados: string[] = [],
    maxLlamadasPorMinuto = 10,
  ) {
    this.agenteReal = agenteReal;
    this.usuariosAutorizados = new Set(usuariosAutorizados);
    this.maxLlamadasPorMinuto = maxLlamadasPorMinuto;
  }

  async procesar(entrada: string, usuario: string = "anonimo"): Promise<string> {
    console.log(`   🔒 [Proxy] Usuario: ${usuario}`);

    // Control 1: Autorización
    if (!this.usuariosAutorizados.has(usuario)) {
      console.log(`      ❌ Acceso denegado: usuario no autorizado`);
      throw new Error(`Usuario ${usuario} no autorizado`);
    }

    // Control 2: Rate limiting
    const llamadasActuales = this.rateLimitPorUsuario.get(usuario) || 0;
    if (llamadasActuales >= this.maxLlamadasPorMinuto) {
      console.log(
        `      ⚠️  Rate limit excedido (${llamadasActuales}/${this.maxLlamadasPorMinuto})`,
      );
      throw new Error("Demasiadas solicitudes. Intenta más tarde.");
    }

    // Incrementar contador
    this.rateLimitPorUsuario.set(usuario, llamadasActuales + 1);
    console.log(`      ✅ Autorizado. Llamadas: ${llamadasActuales + 1}/${this.maxLlamadasPorMinuto}`);

    // Delegar al objeto real
    return this.agenteReal.procesar(entrada);
  }

  obtenerNombre(): string {
    return this.agenteReal.obtenerNombre();
  }

  reiniciarRateLimit(): void {
    this.rateLimitPorUsuario.clear();
    console.log("   🔄 Rate limit reiniciado");
  }
}

// ── PROXY: Lazy loading ────────────────────────────────────────
export class ProxyAgenteLazy implements AgenteAPI {
  private agenteReal: AgenteReal | null = null;
  private nombre: string;
  private client: OpenAI;

  constructor(nombre: string, client: OpenAI = makeClient()) {
    this.nombre = nombre;
    this.client = client;
    console.log(`   📦 Proxy lazy creado (agente no inicializado aún)`);
  }

  private inicializarSiNecesario(): void {
    if (!this.agenteReal) {
      console.log(`   ⚡ Inicializando agente real (lazy loading)...`);
      this.agenteReal = new AgenteReal(this.nombre, this.client);
    }
  }

  async procesar(entrada: string): Promise<string> {
    this.inicializarSiNecesario();
    return this.agenteReal!.procesar(entrada);
  }

  obtenerNombre(): string {
    return this.nombre;
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export async function demostrarProxy(
  client: OpenAI = makeClient(),
): Promise<void> {
  paso("🔐", "Demostrando Proxy Pattern");

  paso("1️⃣", "Proxy con control de acceso y rate limiting");

  const agenteReal = new AgenteReal("Especialista", client);
  const proxy = new ProxyAgenteControlado(agenteReal, ["alice", "bob"], 3);

  console.log(`\n   Intento 1: Usuario autorizado`);
  try {
    await proxy.procesar("¿Qué es IA?", "alice");
    console.log(`      Resultado: ✓`);
  } catch (error) {
    console.log(`      Error: ${error}`);
  }

  console.log(`\n   Intento 2: Usuario no autorizado`);
  try {
    await proxy.procesar("¿Qué es IA?", "charlie");
    console.log(`      Resultado: ✓`);
  } catch (error) {
    console.log(`      Error: ${error}`);
  }

  console.log(`\n   Intento 3: Alice hace 2 más (total 3)`);
  try {
    await proxy.procesar("Pregunta 2", "alice");
    await proxy.procesar("Pregunta 3", "alice");
    console.log(`      Resultado: ✓`);
  } catch (error) {
    console.log(`      Error: ${error}`);
  }

  console.log(`\n   Intento 4: Alice excede rate limit`);
  try {
    await proxy.procesar("Pregunta 4", "alice");
    console.log(`      Resultado: ✓`);
  } catch (error) {
    console.log(`      Error: ${error}`);
  }

  paso("2️⃣", "Proxy con lazy loading");

  const proxyLazy = new ProxyAgenteLazy("Agente Lazy", client);
  console.log(`\n   Agente creado pero no inicializado`);

  console.log(`\n   Primera llamada (inicializa)`);
  await proxyLazy.procesar("Mi pregunta");

  console.log(`\n   Segunda llamada (reutiliza instancia)`);
  await proxyLazy.procesar("Otra pregunta");

  paso("✅", "Proxy controlando acceso correctamente");
}

async function main(): Promise<void> {
  await demostrarProxy();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
