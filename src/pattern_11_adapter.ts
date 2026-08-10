/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 11 — ADAPTER (PATRÓN ESTRUCTURAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Respuesta LLM]
 *      │
 *      ▼
 *  [AdapterJSON]      o      [AdapterXML]      o      [AdapterSQL]
 *      │                           │                       │
 *      └─────────────┬─────────────┴───────────────────────┘
 *                    │
 *                    ▼
 *          [Formato Target Compatible]
 *
 *  Idea: Adaptar la interfaz de un objeto (respuesta LLM) a otra que
 *  esperan los clientes (JSON, XML, HTML, SQL, Markdown).
 *
 *  Referencia: https://refactoring.guru/design-patterns/adapter
 *
 *  Ventajas:
 *  - LLM siempre responde en texto natural
 *  - Podemos adaptar a cualquier formato downstream
 *  - Desacoplamiento entre LLM y sistemas que usan la respuesta
 *  - Fácil agregar nuevos formatos sin tocar LLM
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── Tipos de formatos ──────────────────────────────────────────
export interface RespuestaLLM {
  contenido: string;
  metadata: {
    modelo: string;
    timestamp: Date;
    tokens: number;
  };
}

export interface RespuestaFormato {
  formato: string;
  contenido: string | Record<string, unknown> | unknown;
}

// ── ADAPTERS: Interfaces para diferentes formatos ──────────────
export interface Adaptador {
  adaptarDesdeLLM(respuesta: RespuestaLLM): RespuestaFormato;
  puedeAdaptar(contenido: string): boolean;
}

// ── Adaptador a JSON ───────────────────────────────────────────
export class AdaptadorJSON implements Adaptador {
  adaptarDesdeLLM(respuesta: RespuestaLLM): RespuestaFormato {
    // Intenta parsear JSON directamente de la respuesta
    const regex = /\{[\s\S]*\}/;
    const match = respuesta.contenido.match(regex);

    if (match) {
      try {
        const json = JSON.parse(match[0]);
        return {
          formato: "application/json",
          contenido: json,
        };
      } catch (e) {
        // Extraer datos y construir JSON
      }
    }

    // Fallback: crear JSON estructurado del contenido
    return {
      formato: "application/json",
      contenido: {
        respuesta: respuesta.contenido,
        metadata: respuesta.metadata,
        estado: "adaptado_desde_texto",
      },
    };
  }

  puedeAdaptar(contenido: string): boolean {
    return contenido.includes("{") && contenido.includes("}");
  }
}

// ── Adaptador a CSV ────────────────────────────────────────────
export class AdaptadorCSV implements Adaptador {
  adaptarDesdeLLM(respuesta: RespuestaLLM): RespuestaFormato {
    // Buscar tablas o listas en el contenido
    const lineas = respuesta.contenido.split("\n").filter((l) => l.trim());

    // Crear CSV desde líneas
    const csv = lineas.map((linea) => {
      // Escapar comillas
      const escapada = linea.replace(/"/g, '""');
      return `"${escapada}"`;
    });

    return {
      formato: "text/csv",
      contenido: csv.join("\n"),
    };
  }

  puedeAdaptar(contenido: string): boolean {
    // Adaptador universal para CSV
    return contenido.trim().length > 0;
  }
}

// ── Adaptador a XML ────────────────────────────────────────────
export class AdaptadorXML implements Adaptador {
  adaptarDesdeLLM(respuesta: RespuestaLLM): RespuestaFormato {
    const contenidoEscapado = respuesta.contenido
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<respuesta>
  <contenido>${contenidoEscapado}</contenido>
  <metadata>
    <modelo>${respuesta.metadata.modelo}</modelo>
    <timestamp>${respuesta.metadata.timestamp.toISOString()}</timestamp>
    <tokens>${respuesta.metadata.tokens}</tokens>
  </metadata>
</respuesta>`;

    return {
      formato: "application/xml",
      contenido: xml,
    };
  }

  puedeAdaptar(): boolean {
    return true;
  }
}

// ── Adaptador a Markdown ───────────────────────────────────────
export class AdaptadorMarkdown implements Adaptador {
  adaptarDesdeLLM(respuesta: RespuestaLLM): RespuestaFormato {
    const markdown = `# Respuesta

${respuesta.contenido}

---

## Metadata
- **Modelo:** ${respuesta.metadata.modelo}
- **Timestamp:** ${respuesta.metadata.timestamp.toISOString()}
- **Tokens:** ${respuesta.metadata.tokens}
`;

    return {
      formato: "text/markdown",
      contenido: markdown,
    };
  }

  puedeAdaptar(): boolean {
    return true;
  }
}

// ── Adaptador a HTML ───────────────────────────────────────────
export class AdaptadorHTML implements Adaptador {
  adaptarDesdeLLM(respuesta: RespuestaLLM): RespuestaFormato {
    const contenidoEscapado = respuesta.contenido
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Respuesta IA</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .respuesta { background: #f5f5f5; padding: 15px; border-radius: 5px; }
    .metadata { font-size: 0.9em; color: #666; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="respuesta">
    <p>${contenidoEscapado}</p>
  </div>
  <div class="metadata">
    <strong>Metadata:</strong>
    <p>Modelo: ${respuesta.metadata.modelo} | Tokens: ${respuesta.metadata.tokens}</p>
  </div>
</body>
</html>`;

    return {
      formato: "text/html",
      contenido: html,
    };
  }

  puedeAdaptar(): boolean {
    return true;
  }
}

// ── Gestor de adaptadores ──────────────────────────────────────
export class GestorAdaptadores {
  private adaptadores: Map<string, Adaptador> = new Map();

  registrarAdaptador(nombre: string, adaptador: Adaptador): void {
    this.adaptadores.set(nombre, adaptador);
  }

  adaptar(
    respuesta: RespuestaLLM,
    formatoDestino: string,
  ): RespuestaFormato {
    const adaptador = this.adaptadores.get(formatoDestino);

    if (!adaptador) {
      throw new Error(`No hay adaptador para formato: ${formatoDestino}`);
    }

    return adaptador.adaptarDesdeLLM(respuesta);
  }

  obtenerFormatosDisponibles(): string[] {
    return Array.from(this.adaptadores.keys());
  }
}

// ── Ejemplo de uso ─────────────────────────────────────────────
export async function demostrarAdapter(
  client: OpenAI = makeClient(),
): Promise<void> {
  paso("🔌", "Demostrando Adapter Pattern");

  // Obtener respuesta del LLM
  paso("📝", "Obteniendo respuesta del LLM...");

  const respuestaLLM = await client.responses.create({
    model: DEFAULT_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions:
      "Proporciona una lista de 3 características de los agentes IA modernos",
    input: "Dame información",
  });

  const respuestaOriginal: RespuestaLLM = {
    contenido: respuestaLLM.output_text,
    metadata: {
      modelo: DEFAULT_MODEL,
      timestamp: new Date(),
      tokens: 150,
    },
  };

  console.log(`   Contenido original: ${respuestaOriginal.contenido.slice(0, 100)}…`);

  // Crear gestor de adaptadores
  paso("🔧", "Registrando adaptadores");

  const gestor = new GestorAdaptadores();
  gestor.registrarAdaptador("json", new AdaptadorJSON());
  gestor.registrarAdaptador("csv", new AdaptadorCSV());
  gestor.registrarAdaptador("xml", new AdaptadorXML());
  gestor.registrarAdaptador("markdown", new AdaptadorMarkdown());
  gestor.registrarAdaptador("html", new AdaptadorHTML());

  console.log(
    `   Formatos disponibles: ${gestor.obtenerFormatosDisponibles().join(", ")}`,
  );

  // Adaptar a diferentes formatos
  paso("🔄", "Adaptando respuesta a múltiples formatos");

  // JSON
  const formatosParaPrueba = ["json", "csv", "xml", "markdown"];

  for (const formato of formatosParaPrueba) {
    const adaptado = gestor.adaptar(respuestaOriginal, formato);
    console.log(`\n   📌 Formato ${formato.toUpperCase()}:`);

    if (typeof adaptado.contenido === "string") {
      console.log(`      ${adaptado.contenido.slice(0, 80)}…`);
    } else {
      console.log(
        `      ${JSON.stringify(adaptado.contenido).slice(0, 80)}…`,
      );
    }
  }
}

async function main(): Promise<void> {
  await demostrarAdapter();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
