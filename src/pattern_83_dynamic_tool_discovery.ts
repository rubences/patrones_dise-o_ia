/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 83 — DYNAMIC TOOL DISCOVERY (DESCUBRIMIENTO DINÁMICO)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Agente arranca SIN conocer las herramientas de antemano]
 *       │
 *       ▼
 *  [Cliente MCP] ──tools/list──▶ [Servidor MCP]
 *       │
 *       ▼
 *  [Lista de tools + JSON Schema de cada una]
 *       │
 *       ▼
 *  [Construir schema de function-calling en runtime]
 *       │
 *       ▼
 *  [openai.responses.create({ tools: schemaDinamico })]
 *
 *  Idea: en vez de hardcodear qué herramientas existen (como en el
 *  Patrón 5), el agente las descubre en tiempo de ejecución
 *  consultando un servidor MCP. Si el servidor añade, quita o cambia
 *  una herramienta, el agente lo refleja automáticamente en el
 *  siguiente arranque, sin tocar código.
 *
 *  Diferencia vs Patrón 65 (Agent Registry): Agent Registry descubre
 *  y localiza AGENTES (procesos con handlers en memoria) por
 *  habilidad. Este patrón descubre HERRAMIENTAS expuestas por un
 *  servidor de protocolo (MCP), incluyendo su schema de entrada — el
 *  resultado se usa para construir la definición de function-calling
 *  del LLM, no para invocar un handler local directamente.
 *
 *  Ventajas:
 *  - Cero acoplamiento entre el catálogo de tools y el código del agente
 *  - Un servidor MCP puede añadir herramientas sin desplegar el agente
 *  - El schema de entrada validado viaja con el descubrimiento
 *  - Mismo mecanismo sirve para componer múltiples servidores MCP
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { crearServidorPatrones } from "./pattern_82_mcp_server.js";
import { isDirectRun, paso } from "./common.js";

export interface HerramientaDescubierta {
  nombre: string;
  descripcion?: string;
  parametros: unknown;
}

export interface FuncionOpenAI {
  type: "function";
  function: { name: string; description: string; parameters: unknown };
}

// Consulta tools/list — no requiere conocer las herramientas de antemano.
export async function descubrirHerramientas(cliente: Client): Promise<HerramientaDescubierta[]> {
  const { tools } = await cliente.listTools();
  return tools.map((t) => ({ nombre: t.name, descripcion: t.description, parametros: t.inputSchema }));
}

// Construye el schema de function-calling en runtime, sin definiciones hardcodeadas.
export function aEsquemaFunctionCalling(herramientas: HerramientaDescubierta[]): FuncionOpenAI[] {
  return herramientas.map((h) => ({
    type: "function" as const,
    function: { name: h.nombre, description: h.descripcion ?? "", parameters: h.parametros },
  }));
}

export async function demostrarDynamicToolDiscovery(): Promise<void> {
  paso("🔎", "Demostrando Dynamic Tool Discovery Pattern");

  paso("1️⃣", "Conectar a un servidor MCP sin conocer sus tools de antemano");
  const servidor = crearServidorPatrones();
  const [transporteServidor, transporteCliente] = InMemoryTransport.createLinkedPair();
  const cliente = new Client({ name: "agente-dinamico", version: "1.0.0" });
  await Promise.all([servidor.connect(transporteServidor), cliente.connect(transporteCliente)]);

  paso("2️⃣", "Descubrir las herramientas disponibles en runtime (tools/list)");
  const herramientas = await descubrirHerramientas(cliente);
  herramientas.forEach((h) => console.log(`   • ${h.nombre}: ${h.descripcion}`));

  paso("3️⃣", "Construir el schema de function-calling dinámicamente");
  const esquema = aEsquemaFunctionCalling(herramientas);
  console.log(`   ${esquema.length} funciones listas para pasar a openai.responses.create({ tools })`);
  console.log(`   Ejemplo: ${JSON.stringify(esquema[0], null, 2).slice(0, 200)}...`);

  paso("4️⃣", "Simular que el modelo elige invocar una herramienta descubierta");
  const elegida = herramientas.find((h) => h.nombre === "listar_categorias");
  if (!elegida) throw new Error("El servidor no expuso 'listar_categorias'");
  console.log(`   El modelo elige: ${elegida.nombre}`);
  const resultado = await cliente.callTool({ name: elegida.nombre, arguments: {} });
  console.log(`   Resultado:`, resultado.content);

  await cliente.close();
  paso("✅", "Dynamic Tool Discovery evitando hardcodear definiciones de herramientas");
}

async function main(): Promise<void> {
  await demostrarDynamicToolDiscovery();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
