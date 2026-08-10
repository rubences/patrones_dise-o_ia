/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 37 — KNOWLEDGE GRAPH (GRAFO DE CONOCIMIENTO)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Nodo: Agente] ──es_un──▶ [Nodo: Sistema IA]
 *       │                            │
 *  usa_patron                   implementa
 *       │                            │
 *       ▼                            ▼
 *  [Nodo: RAG] ──mejora──▶ [Nodo: Respuesta]
 *       │
 *  combina_con
 *       │
 *       ▼
 *  [Nodo: CoT]
 *
 *  [Consulta] → Traversal del grafo → Contexto enriquecido → LLM
 *
 *  Idea: Estructurar el conocimiento como grafo de entidades
 *  y relaciones para enriquecer el contexto del LLM.
 *
 *  Ventajas:
 *  - Conocimiento estructurado y navegable
 *  - Relaciones semánticas entre conceptos
 *  - Mejor que RAG para dominios con alta interconexión
 *  - Permite razonamiento por grafos
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

export interface Nodo {
  id: string;
  tipo: string;
  propiedades: Record<string, string>;
}

export interface Relacion {
  origen: string;
  tipo: string;
  destino: string;
  peso?: number;
}

export class GrafoConocimiento {
  private nodos: Map<string, Nodo> = new Map();
  private relaciones: Relacion[] = [];

  agregarNodo(nodo: Nodo): void {
    this.nodos.set(nodo.id, nodo);
  }

  agregarRelacion(relacion: Relacion): void {
    this.relaciones.push(relacion);
  }

  obtenerVecinos(idNodo: string): { nodo: Nodo; relacion: string }[] {
    return this.relaciones
      .filter((r) => r.origen === idNodo || r.destino === idNodo)
      .map((r) => {
        const esOrigen = r.origen === idNodo;
        const idVecino = esOrigen ? r.destino : r.origen;
        const nodo = this.nodos.get(idVecino);
        return nodo ? { nodo, relacion: r.tipo } : null;
      })
      .filter((v): v is { nodo: Nodo; relacion: string } => v !== null);
  }

  buscar(termino: string): Nodo[] {
    return Array.from(this.nodos.values()).filter(
      (n) =>
        n.id.toLowerCase().includes(termino.toLowerCase()) ||
        Object.values(n.propiedades).some((v) =>
          v.toLowerCase().includes(termino.toLowerCase()),
        ),
    );
  }

  // Generar contexto para LLM recorriendo el grafo
  construirContexto(nodoInicial: string, profundidad = 2): string {
    const visitados = new Set<string>();
    const fragmentos: string[] = [];

    const recorrer = (id: string, nivel: number) => {
      if (nivel > profundidad || visitados.has(id)) return;
      visitados.add(id);

      const nodo = this.nodos.get(id);
      if (!nodo) return;

      fragmentos.push(`[${nodo.tipo}] ${nodo.id}: ${JSON.stringify(nodo.propiedades)}`);

      this.obtenerVecinos(id).forEach(({ nodo: vecino, relacion }) => {
        fragmentos.push(`  --${relacion}→ ${vecino.id}`);
        recorrer(vecino.id, nivel + 1);
      });
    };

    recorrer(nodoInicial, 0);
    return fragmentos.join("\n");
  }
}

export class AgenteConKnowledgeGraph {
  private grafo: GrafoConocimiento;
  private client: OpenAI;

  constructor(client: OpenAI = makeClient()) {
    this.client = client;
    this.grafo = new GrafoConocimiento();
    this.inicializarGrafo();
  }

  private inicializarGrafo(): void {
    // Nodos
    this.grafo.agregarNodo({ id: "RAG", tipo: "Patron", propiedades: { descripcion: "Recuperación aumentada" } });
    this.grafo.agregarNodo({ id: "CoT", tipo: "Patron", propiedades: { descripcion: "Razonamiento paso-a-paso" } });
    this.grafo.agregarNodo({ id: "ToT", tipo: "Patron", propiedades: { descripcion: "Árbol de pensamiento" } });
    this.grafo.agregarNodo({ id: "Agente", tipo: "Concepto", propiedades: { descripcion: "Sistema autónomo de IA" } });
    this.grafo.agregarNodo({ id: "LLM", tipo: "Tecnologia", propiedades: { modelo: "gpt-4", uso: "inferencia" } });
    this.grafo.agregarNodo({ id: "VectorDB", tipo: "Tecnologia", propiedades: { tipo: "almacenamiento vectorial" } });

    // Relaciones
    this.grafo.agregarRelacion({ origen: "RAG", tipo: "usa", destino: "VectorDB", peso: 0.9 });
    this.grafo.agregarRelacion({ origen: "RAG", tipo: "mejora", destino: "LLM", peso: 0.8 });
    this.grafo.agregarRelacion({ origen: "CoT", tipo: "mejora", destino: "LLM", peso: 0.7 });
    this.grafo.agregarRelacion({ origen: "ToT", tipo: "extiende", destino: "CoT", peso: 0.9 });
    this.grafo.agregarRelacion({ origen: "Agente", tipo: "usa", destino: "LLM", peso: 1.0 });
    this.grafo.agregarRelacion({ origen: "Agente", tipo: "aplica", destino: "RAG", peso: 0.8 });
  }

  async responderConGrafo(pregunta: string): Promise<string> {
    console.log(`\n   🔍 Buscando en Knowledge Graph: "${pregunta.slice(0, 50)}..."`);

    // Buscar nodos relevantes
    const terminos = pregunta.split(" ").filter((p) => p.length > 3);
    const nodosRelevantes = terminos.flatMap((t) => this.grafo.buscar(t)).slice(0, 3);

    console.log(`   ✓ ${nodosRelevantes.length} nodos relevantes encontrados`);

    // Construir contexto desde el grafo
    let contexto = "";
    for (const nodo of nodosRelevantes) {
      contexto += this.grafo.construirContexto(nodo.id, 2) + "\n";
    }

    if (!contexto) {
      contexto = this.grafo.construirContexto("Agente", 1);
    }

    console.log(`   ✓ Contexto construido (${contexto.length} chars)`);

    const resp = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Usando este grafo de conocimiento, responde la pregunta:

GRAFO DE CONOCIMIENTO:
${contexto}

PREGUNTA: ${pregunta}`,
      input: "",
    });

    return resp.output_text;
  }
}

export async function demostrarKnowledgeGraph(client: OpenAI = makeClient()): Promise<void> {
  paso("🕸️", "Demostrando Knowledge Graph Pattern");

  const agente = new AgenteConKnowledgeGraph(client);

  paso("1️⃣", "Consulta sobre relaciones entre patrones");
  const r1 = await agente.responderConGrafo("¿Cómo se relacionan RAG y LLM?");
  console.log(`\n   Respuesta: "${r1.slice(0, 200)}..."\n`);

  paso("2️⃣", "Consulta sobre tecnologías");
  const r2 = await agente.responderConGrafo("¿Qué tecnologías usan los agentes?");
  console.log(`\n   Respuesta: "${r2.slice(0, 200)}..."\n`);

  paso("3️⃣", "Traversal manual del grafo");
  const grafo = new GrafoConocimiento();
  grafo.agregarNodo({ id: "A", tipo: "Test", propiedades: { info: "Nodo A" } });
  grafo.agregarNodo({ id: "B", tipo: "Test", propiedades: { info: "Nodo B" } });
  grafo.agregarRelacion({ origen: "A", tipo: "conecta", destino: "B" });

  const vecinos = grafo.obtenerVecinos("A");
  console.log(`   Vecinos de A: ${vecinos.map((v) => v.nodo.id).join(", ")}`);

  paso("✅", "Knowledge Graph enriqueciendo contexto con relaciones semánticas");
}

async function main(): Promise<void> {
  await demostrarKnowledgeGraph();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => { console.error(e); process.exitCode = 1; });
}
