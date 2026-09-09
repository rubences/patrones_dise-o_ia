import test from "node:test";
import assert from "node:assert/strict";
import {
  parsearPlanOrquestador,
  subtareasListas,
  type Subtarea,
} from "../../src/pattern_60_orchestrator_workers.js";

test("parsea dependencias explícitas del plan", () => {
  const plan = parsearPlanOrquestador([
    "TAREA1: investigar | WORKER: investigador | DEPS: ninguna",
    "TAREA2: analizar | WORKER: analista | DEPS: TAREA1",
    "TAREA3: redactar | WORKER: redactor | DEPS: TAREA1,TAREA2",
  ].join("\n"));

  assert.deepEqual(plan.map((s) => s.id), ["t1", "t2", "t3"]);
  assert.deepEqual(plan[0].dependencias, []);
  assert.deepEqual(plan[1].dependencias, ["t1"]);
  assert.deepEqual(plan[2].dependencias, ["t1", "t2"]);
});

test("no despacha una subtarea hasta completar sus dependencias", () => {
  const tareas: Subtarea[] = [
    { id: "t1", descripcion: "A", worker: "analista", dependencias: [], estado: "pendiente" },
    { id: "t2", descripcion: "B", worker: "redactor", dependencias: ["t1"], estado: "pendiente" },
  ];

  assert.deepEqual(subtareasListas(tareas).map((s) => s.id), ["t1"]);
  tareas[0].estado = "completada";
  assert.deepEqual(subtareasListas(tareas).map((s) => s.id), ["t2"]);
});

test("un ciclo no produce ninguna subtarea lista", () => {
  const tareas: Subtarea[] = [
    { id: "t1", descripcion: "A", worker: "analista", dependencias: ["t2"], estado: "pendiente" },
    { id: "t2", descripcion: "B", worker: "redactor", dependencias: ["t1"], estado: "pendiente" },
  ];
  assert.deepEqual(subtareasListas(tareas), []);
});
