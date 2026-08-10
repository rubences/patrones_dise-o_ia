/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 82 — MCP SERVER EXPOSURE (SERVIDOR MCP)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Agente / Cliente MCP]
 *       │
 *       ▼
 *  [Transporte: stdio / HTTP / in-memory]
 *       │
 *       ▼
 *  [Servidor MCP]
 *  ├─ tools/list   → describe las herramientas disponibles (schema Zod)
 *  ├─ tools/call   → invoca una herramienta con argumentos validados
 *  └─ resources/*  → expone datos/recursos adicionales
 *
 *  Idea: exponer las capacidades de un agente (o de un dominio de
 *  datos) como un servidor Model Context Protocol estándar, en vez de
 *  una API ad-hoc. Cualquier cliente MCP compatible (otro agente,
 *  Claude Desktop, un IDE) puede descubrir e invocar las herramientas
 *  sin conocer su implementación interna.
 *
 *  Diferencia vs Patrón 5 (Tool Use): Tool Use decide dinámicamente
 *  QUÉ herramienta usar dentro de un único proceso con definiciones
 *  hardcodeadas. Este patrón trata la exposición de herramientas como
 *  un contrato de protocolo versionado y descubrible entre procesos.
 *
 *  Ventajas:
 *  - Interoperabilidad estándar (cualquier cliente MCP conecta)
 *  - Contrato de entrada validado por schema (Zod) en el servidor
 *  - Desacopla "quién expone la herramienta" de "quién la consume"
 *  - Mismo servidor sirve por stdio, HTTP o in-memory sin cambiar tools
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { z } from "zod";
import { isDirectRun, paso } from "./common.js";

export interface PatronCatalogo {
  numero: number;
  nombre: string;
  categoria: string;
}

// Catálogo mínimo reutilizado también por el Patrón 83 (Dynamic Tool Discovery).
export const CATALOGO_PATRONES: PatronCatalogo[] = [
  { numero: 25, nombre: "RAG", categoria: "agentico" },
  { numero: 45, nombre: "Circuit Breaker", categoria: "confiabilidad" },
  { numero: 53, nombre: "Guardrails", categoria: "seguridad" },
  { numero: 73, nombre: "LLM-as-Judge", categoria: "qa" },
  { numero: 77, nombre: "Observability", categoria: "produccion" },
];

// ── Construcción del servidor: separado de la conexión/transporte ──
export function crearServidorPatrones(): McpServer {
  const server = new McpServer({ name: "catalogo-patrones-ia", version: "1.0.0" });

  server.registerTool(
    "buscar_patron",
    {
      title: "Buscar patrón por nombre",
      description: "Busca patrones de diseño de IA por coincidencia parcial en el nombre.",
      inputSchema: { consulta: z.string().describe("Texto a buscar en el nombre del patrón") },
    },
    async ({ consulta }) => {
      const resultados = CATALOGO_PATRONES.filter((p) =>
        p.nombre.toLowerCase().includes(consulta.toLowerCase()),
      );
      return { content: [{ type: "text", text: JSON.stringify(resultados) }] };
    },
  );

  server.registerTool(
    "listar_categorias",
    {
      title: "Listar categorías",
      description: "Lista las categorías únicas presentes en el catálogo de patrones.",
      inputSchema: {},
    },
    async () => {
      const categorias = [...new Set(CATALOGO_PATRONES.map((p) => p.categoria))];
      return { content: [{ type: "text", text: JSON.stringify(categorias) }] };
    },
  );

  return server;
}

export async function demostrarMCPServerExposure(): Promise<void> {
  paso("🔌", "Demostrando MCP Server Exposure Pattern");

  paso("1️⃣", "Construir el servidor MCP con 2 tools registradas");
  const server = crearServidorPatrones();
  console.log(`   Tools registradas: buscar_patron, listar_categorias`);

  paso("2️⃣", "Conectar un cliente MCP en memoria (mismo proceso, sin stdio/subprocess)");
  const [transporteServidor, transporteCliente] = InMemoryTransport.createLinkedPair();
  const cliente = new Client({ name: "cliente-demo", version: "1.0.0" });

  await Promise.all([server.connect(transporteServidor), cliente.connect(transporteCliente)]);
  console.log(`   ✓ Cliente conectado. Servidor conectado: ${server.isConnected()}`);

  paso("3️⃣", "Cliente invoca buscar_patron('guardrails') vía tools/call");
  const resultado = await cliente.callTool({
    name: "buscar_patron",
    arguments: { consulta: "guardrails" },
  });
  console.log(`   Resultado:`, resultado.content);

  paso("4️⃣", "Cliente descubre las tools disponibles vía tools/list");
  const { tools } = await cliente.listTools();
  console.log(`   Tools descubiertas: ${tools.map((t) => t.name).join(", ")}`);

  await cliente.close();
  paso("✅", "MCP Server Exposure habilitando interoperabilidad estándar agente ↔ herramientas");
}

async function main(): Promise<void> {
  await demostrarMCPServerExposure();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
