import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import OpenAI from "openai";

// El SDK lee OPENAI_API_KEY automáticamente de las variables de entorno.
export const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-5.6";

export function makeClient(): OpenAI {
  return new OpenAI();
}

// Imprime un banner para separar visualmente cada paso en la consola.
export function paso(emoji: string, texto: string): void {
  console.log(`\n${emoji}  ${texto}`);
  console.log("─".repeat(60));
}

// ¿Se está ejecutando este archivo directamente con `node`?
export function isDirectRun(moduleUrl: string): boolean {
  const entryPoint = process.argv[1];
  return (
    entryPoint !== undefined &&
    moduleUrl === pathToFileURL(resolve(entryPoint)).href
  );
}
