/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 84 — CODE EXECUTION SANDBOXING (AISLAMIENTO DE EJECUCIÓN)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Código generado por el LLM]
 *       │
 *       ▼
 *  [Contexto aislado (node:vm)]
 *  ├─ Sin `require` / `process` / `fs` / red — global object propio
 *  ├─ Timeout duro → corta bucles infinitos
 *  └─ Salida de consola capturada, no impresa directamente
 *       │
 *       ▼
 *  ¿Excepción o timeout? ──SÍ──▶ Error estructurado, nunca crashea el host
 *       │
 *      NO
 *       ▼
 *  [Valor de retorno + logs capturados]
 *
 *  Idea: cuando un agente genera y ejecuta código (cálculos, scripts
 *  de análisis, transformaciones de datos), ese código NO es de
 *  confianza — viene de un LLM que puede alucinar, o de un prompt
 *  envenenado (ver Patrón 69). Aislarlo evita que acceda al sistema
 *  de archivos, red, variables de entorno, o cuelgue el proceso host.
 *
 *  ⚠️  Advertencia honesta: `node:vm` aísla el ESPACIO GLOBAL, no es
 *  un sandbox de seguridad completo — existen técnicas conocidas de
 *  escape del contexto en Node.js. Para código verdaderamente no
 *  confiable en producción, combinar con aislamiento a nivel de
 *  proceso/SO (contenedor efímero, gVisor, Firecracker, WASM) además
 *  de este límite de lenguaje. Este patrón es la primera capa
 *  (rápida, sin infraestructura extra), no la única.
 *
 *  Ventajas:
 *  - Sin dependencias externas (node:vm es stdlib)
 *  - Timeout determinista para bucles infinitos o código muy lento
 *  - Superficie de API expuesta al código controlada explícitamente
 *  - Salida capturada, auditable antes de mostrarla al usuario
 */

import vm from "node:vm";
import { isDirectRun, paso } from "./common.js";

export interface ConfigSandbox {
  timeoutMs: number;
}

export interface ResultadoSandbox {
  exito: boolean;
  valorRetornado?: unknown;
  salidaConsola: string[];
  error?: string;
  duracionMs: number;
}

const CONFIG_DEFECTO: ConfigSandbox = { timeoutMs: 1000 };

export function ejecutarEnSandbox(codigo: string, config: ConfigSandbox = CONFIG_DEFECTO): ResultadoSandbox {
  const inicio = Date.now();
  const salidaConsola: string[] = [];

  // Global object mínimo: solo lo que el código de análisis necesita.
  // Deliberadamente AUSENTES: require, process, fetch, Buffer, __dirname,
  // module — no existen en este contexto salvo que se añadan aquí.
  const sandbox: Record<string, unknown> = {
    console: { log: (...args: unknown[]) => salidaConsola.push(args.map(String).join(" ")) },
    Math,
    JSON,
  };
  const contexto = vm.createContext(sandbox);

  try {
    const script = new vm.Script(codigo);
    const valorRetornado = script.runInContext(contexto, { timeout: config.timeoutMs });
    return { exito: true, valorRetornado, salidaConsola, duracionMs: Date.now() - inicio };
  } catch (error) {
    return {
      exito: false,
      salidaConsola,
      error: error instanceof Error ? error.message : String(error),
      duracionMs: Date.now() - inicio,
    };
  }
}

export async function demostrarCodeSandboxing(): Promise<void> {
  paso("🧪", "Demostrando Code Execution Sandboxing Pattern");

  paso("1️⃣", "Código legítimo generado por el agente: cálculo simple");
  const r1 = ejecutarEnSandbox(`
    console.log("calculando...");
    const resultado = 6 * 7;
    resultado;
  `);
  console.log(`   Éxito: ${r1.exito} | Valor: ${r1.valorRetornado} | Consola: ${r1.salidaConsola.join(" | ")}`);

  paso("2️⃣", "Código que intenta acceder al sistema de archivos → bloqueado (sin require)");
  const r2 = ejecutarEnSandbox(`require("fs").readFileSync("/etc/passwd")`);
  console.log(`   Éxito: ${r2.exito} | Error: ${r2.error}`);

  paso("3️⃣", "Código con bucle infinito → cortado por timeout, no cuelga el host");
  const r3 = ejecutarEnSandbox(`while (true) {}`, { timeoutMs: 200 });
  console.log(`   Éxito: ${r3.exito} | Error: ${r3.error} | Duración: ${r3.duracionMs}ms`);

  paso("4️⃣", "Código que intenta acceder a variables de entorno del host → bloqueado (sin process)");
  const r4 = ejecutarEnSandbox(`process.env.OPENAI_API_KEY`);
  console.log(`   Éxito: ${r4.exito} | Error: ${r4.error}`);

  paso("✅", "Code Execution Sandboxing aislando código generado por el agente antes de confiar en su salida");
}

async function main(): Promise<void> {
  await demostrarCodeSandboxing();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
