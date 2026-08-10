/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 17 — COMPOSITE (STRUCTURAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Tareas Compositas]
 *      │
 *      ├─ Tarea 1 (Hoja)
 *      │
 *      ├─ Tarea 2 (Compuesta)
 *      │  ├─ Subtarea 2.1
 *      │  ├─ Subtarea 2.2
 *      │  └─ Subtarea 2.3
 *      │
 *      └─ Tarea 3 (Hoja)
 *
 *  Idea: Componer objetos en estructuras de árbol para representar
 *  jerarquías parte-todo. Permite tratar objetos individuales y
 *  composiciones de forma uniforme.
 *
 *  Referencia: https://refactoring.guru/design-patterns/composite
 *
 *  Ventajas:
 *  - Jerarquías naturales (tareas anidadas)
 *  - Interfaz uniforme para simples y complejas
 *  - Fácil agregar nuevas operaciones
 *  - Recursión elegante
 */

import OpenAI from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── Interfaz común ─────────────────────────────────────────────
export interface Tarea {
  nombre: string;
  ejecutar(client: OpenAI): Promise<string>;
  agregarSubtarea(tarea: Tarea): void;
  obtenerSubtareas(): Tarea[];
  obtenerDuracionEstimada(): number;
}

// ── HOJA: Tarea simple sin subtareas ───────────────────────────
export class TareaSimple implements Tarea {
  nombre: string;
  descripcion: string;
  duracionEstimada: number;

  constructor(nombre: string, descripcion: string, duracionEstimada = 1) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.duracionEstimada = duracionEstimada;
  }

  async ejecutar(client: OpenAI): Promise<string> {
    console.log(`   ⚙️  ${this.nombre}`);

    const respuesta = await client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Completa brevemente: ${this.descripcion}`,
      input: "",
    });

    return respuesta.output_text;
  }

  agregarSubtarea(): void {
    throw new Error("Las tareas simples no pueden tener subtareas");
  }

  obtenerSubtareas(): Tarea[] {
    return [];
  }

  obtenerDuracionEstimada(): number {
    return this.duracionEstimada;
  }
}

// ── COMPUESTA: Tarea que contiene otras tareas ─────────────────
export class TareaCompuesta implements Tarea {
  nombre: string;
  descripcion: string;
  subtareas: Tarea[] = [];

  constructor(nombre: string, descripcion: string) {
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  async ejecutar(client: OpenAI): Promise<string> {
    console.log(`🔄 ${this.nombre} (${this.subtareas.length} subtareas)`);

    const resultados: string[] = [];

    for (const subtarea of this.subtareas) {
      try {
        const resultado = await subtarea.ejecutar(client);
        resultados.push(`✓ ${subtarea.nombre}`);
      } catch (error) {
        resultados.push(`✗ ${subtarea.nombre}: ${error}`);
      }
    }

    return resultados.join("\n");
  }

  agregarSubtarea(tarea: Tarea): void {
    this.subtareas.push(tarea);
  }

  obtenerSubtareas(): Tarea[] {
    return this.subtareas;
  }

  obtenerDuracionEstimada(): number {
    return this.subtareas.reduce(
      (total, tarea) => total + tarea.obtenerDuracionEstimada(),
      0,
    );
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export async function demostrarComposite(
  client: OpenAI = makeClient(),
): Promise<void> {
  paso("🌳", "Demostrando Composite Pattern");

  paso("1️⃣", "Crear jerarquía de tareas");

  // Hojas
  const tarea1 = new TareaSimple(
    "Investigar",
    "Investiga sobre IA",
    1,
  );
  const tarea2 = new TareaSimple(
    "Analizar",
    "Analiza los hallazgos",
    2,
  );
  const tarea3 = new TareaSimple(
    "Documentar",
    "Documenta conclusiones",
    1,
  );

  // Tarea compuesta
  const investigacion = new TareaCompuesta("Investigación completa", "");
  investigacion.agregarSubtarea(tarea1);
  investigacion.agregarSubtarea(tarea2);
  investigacion.agregarSubtarea(tarea3);

  console.log(`   Duración estimada: ${investigacion.obtenerDuracionEstimada()} horas`);
  console.log(`   Subtareas: ${investigacion.obtenerSubtareas().length}`);

  paso("2️⃣", "Proyecto con múltiples fases");

  // Fase 1
  const fase1 = new TareaCompuesta("Fase 1: Diseño", "");
  fase1.agregarSubtarea(
    new TareaSimple("Definir requisitos", "...", 1),
  );
  fase1.agregarSubtarea(
    new TareaSimple("Arquitectura", "...", 2),
  );

  // Fase 2
  const fase2 = new TareaCompuesta("Fase 2: Implementación", "");
  fase2.agregarSubtarea(
    new TareaSimple("Coding", "...", 4),
  );
  fase2.agregarSubtarea(
    new TareaSimple("Testing", "...", 2),
  );

  // Proyecto completo (compuesta de compuestas)
  const proyecto = new TareaCompuesta("Proyecto IA Completo", "");
  proyecto.agregarSubtarea(fase1);
  proyecto.agregarSubtarea(fase2);

  console.log(`\n   Estructura de proyecto:`);
  console.log(`   - Duración total: ${proyecto.obtenerDuracionEstimada()} horas`);
  console.log(`   - Fases principales: ${proyecto.obtenerSubtareas().length}`);

  paso("3️⃣", "Ejecutar tareas jerárquicas");

  console.log(`\n   Ejecutando investigación:`);
  await investigacion.ejecutar(client);

  console.log(`\n   ✅ Jerarquía de tareas completada`);
}

async function main(): Promise<void> {
  await demostrarComposite();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
