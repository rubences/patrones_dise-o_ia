/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 20 — COMMAND (BEHAVIORAL)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Cliente]
 *       │
 *       ▼
 *  [Invoker: ColaComandos]
 *       │
 *       ├─ encolar(comando1)
 *       ├─ encolar(comando2)
 *       └─ ejecutar() ──┬──▶ Comando1.ejecutar() ──▶ Receptor1
 *                       └──▶ Comando2.ejecutar() ──▶ Receptor2
 *
 *  Idea: Encapsular una solicitud como un objeto, permitiendo
 *  parametrizar clientes con operaciones, encoladas, registrar
 *  solicitudes, y deshacer operaciones.
 *
 *  Referencia: https://refactoring.guru/design-patterns/command
 *
 *  Ventajas:
 *  - Operaciones como objetos
 *  - Cola de trabajo (task queue)
 *  - Undo/Redo
 *  - Macros y scripts
 *
 *  Casos de uso:
 *  - Encolado de tareas de agentes
 *  - Undo/Redo en interfaces
 *  - Registro de auditoría
 *  - Ejecución asíncrona
 */

import { OpenAI } from "openai";
import { DEFAULT_MODEL, isDirectRun, makeClient, paso } from "./common.js";

// ── Interfaz de Comando ────────────────────────────────────────
export interface Comando {
  ejecutar(): Promise<string>;
  deshacer(): Promise<void>;
}

// ── Comandos concretos ─────────────────────────────────────────
export class ComandoGenerarTexto implements Comando {
  private client: OpenAI;
  private prompt: string;
  private resultado: string = "";

  constructor(client: OpenAI, prompt: string) {
    this.client = client;
    this.prompt = prompt;
  }

  async ejecutar(): Promise<string> {
    console.log(`   ⚙️  Ejecutando: Generar texto`);

    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: this.prompt,
      input: "",
    });

    this.resultado = respuesta.output_text;
    return this.resultado;
  }

  async deshacer(): Promise<void> {
    console.log(`   ↶ Deshaciendo: Generar texto`);
    this.resultado = "";
  }
}

export class ComandoClasificar implements Comando {
  private client: OpenAI;
  private entrada: string;
  private clasificacion: string = "";

  constructor(client: OpenAI, entrada: string) {
    this.client = client;
    this.entrada = entrada;
  }

  async ejecutar(): Promise<string> {
    console.log(`   ⚙️  Ejecutando: Clasificar "${this.entrada.slice(0, 30)}..."`);

    const respuesta = await this.client.responses.create({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      store: false,
      instructions: `Clasifica brevemente: ${this.entrada}`,
      input: "",
    });

    this.clasificacion = respuesta.output_text;
    return this.clasificacion;
  }

  async deshacer(): Promise<void> {
    console.log(`   ↶ Deshaciendo: Clasificar`);
    this.clasificacion = "";
  }
}

export class ComandoAlmacenar implements Comando {
  private id: string;
  private datos: string;

  constructor(datos: string) {
    this.datos = datos;
    this.id = Math.random().toString(36).substring(7);
  }

  async ejecutar(): Promise<string> {
    console.log(`   ⚙️  Ejecutando: Almacenar con ID ${this.id}`);
    return `Almacenado: ${this.id}`;
  }

  async deshacer(): Promise<void> {
    console.log(`   ↶ Deshaciendo: Eliminar ${this.id}`);
  }
}

// ── INVOKER: Cola de comandos ──────────────────────────────────
export class ColaComandos {
  private comandos: Comando[] = [];
  private historialDeshacer: Comando[] = [];

  encolar(comando: Comando): void {
    this.comandos.push(comando);
  }

  async ejecutarTodos(): Promise<string[]> {
    const resultados: string[] = [];

    for (const comando of this.comandos) {
      try {
        const resultado = await comando.ejecutar();
        resultados.push(resultado);
        this.historialDeshacer.push(comando);
      } catch (error) {
        console.log(`   ❌ Error: ${error}`);
      }
    }

    this.comandos = [];
    return resultados;
  }

  async deshacerUltimo(): Promise<void> {
    if (this.historialDeshacer.length === 0) {
      console.log(`   ⚠️  No hay comandos para deshacer`);
      return;
    }

    const ultimoComando = this.historialDeshacer.pop();
    if (ultimoComando) {
      await ultimoComando.deshacer();
    }
  }

  obtenerTamaño(): number {
    return this.comandos.length;
  }

  vaciarCola(): void {
    this.comandos = [];
  }
}

// ── Ejemplo de uso ────────────────────────────────────────────
export async function demostrarCommand(
  client: OpenAI = makeClient(),
): Promise<void> {
  paso("📋", "Demostrando Command Pattern");

  paso("1️⃣", "Encolar múltiples comandos");

  const cola = new ColaComandos();

  cola.encolar(new ComandoGenerarTexto(client, "Escribe un haiku sobre IA"));
  cola.encolar(
    new ComandoClasificar(client, "La IA es el futuro de la tecnología"),
  );
  cola.encolar(new ComandoAlmacenar("Datos importantes"));
  cola.encolar(
    new ComandoClasificar(client, "¿Cuál es la importancia de los patrones?"),
  );

  console.log(`   Cola preparada con ${cola.obtenerTamaño()} comandos\n`);

  paso("2️⃣", "Ejecutar cola");

  const resultados = await cola.ejecutarTodos();
  console.log(`   ✓ ${resultados.length} comandos ejecutados\n`);

  paso("3️⃣", "Deshacer últimas operaciones");

  await cola.deshacerUltimo();
  console.log(`   Deshacer 1 completado\n`);

  await cola.deshacerUltimo();
  console.log(`   Deshacer 2 completado\n`);

  paso("✅", "Queue de comandos completada");
}

async function main(): Promise<void> {
  await demostrarCommand();
}

if (isDirectRun(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
