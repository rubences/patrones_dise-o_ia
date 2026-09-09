import test from "node:test";
import assert from "node:assert/strict";
import { ValidadorLlamadasHerramienta, type DefinicionHerramienta } from "../../src/pattern_101_tool_call_validation.js";

const herramientas: DefinicionHerramienta[] = [
  {
    nombre: "volcar_cache",
    parametros: [{ nombre: "servicio", tipo: "string", requerido: true }],
  },
  {
    nombre: "reiniciar_servicio",
    parametros: [
      { nombre: "servicio", tipo: "string", requerido: true },
      { nombre: "confirmar", tipo: "boolean", requerido: true },
    ],
    debeSeguirA: ["volcar_cache"],
  },
];

test("rechaza argumentos extra no declarados", () => {
  const validador = new ValidadorLlamadasHerramienta(herramientas);
  const r = validador.validar({
    nombre: "volcar_cache",
    argumentos: { servicio: "telemetria", force: true },
  });
  assert.equal(r.valida, false);
  assert.ok(r.errores.some((e) => e.includes('parámetro desconocido "force"')));
});

test("rechaza tipos inválidos y parámetros requeridos ausentes", () => {
  const validador = new ValidadorLlamadasHerramienta(herramientas);
  const r = validador.validar({
    nombre: "reiniciar_servicio",
    argumentos: { servicio: "telemetria", confirmar: "sí" },
  });
  assert.equal(r.valida, false);
  assert.ok(r.errores.some((e) => e.includes("debe ser boolean")));
  assert.ok(r.errores.some((e) => e.includes("secuencia inválida")));
});

test("una llamada correcta pasa solo después del prerrequisito real", () => {
  const validador = new ValidadorLlamadasHerramienta(herramientas);
  const llamada = {
    nombre: "reiniciar_servicio",
    argumentos: { servicio: "telemetria", confirmar: true },
  };

  assert.equal(validador.validar(llamada).valida, false);
  validador.registrarEjecutada("volcar_cache");
  assert.equal(validador.validar(llamada).valida, true);
});

test("no permite registrar como ejecutada una herramienta desconocida", () => {
  const validador = new ValidadorLlamadasHerramienta(herramientas);
  assert.throws(() => validador.registrarEjecutada("inventada"), /herramienta desconocida/);
});
