import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { GestorCheckpoints, JsonFileCheckpointStore } from "../../src/pattern_44_checkpointing.js";

test("un checkpoint JSON sobrevive a recrear el gestor", () => {
  const dir = mkdtempSync(join(tmpdir(), "patrones-cp-"));
  try {
    const ruta = join(dir, "checkpoints.json");
    const gestor1 = new GestorCheckpoints(new JsonFileCheckpointStore(ruta));
    gestor1.iniciar("tarea-1");
    gestor1.guardar(2, { fase: "diseño" }, ["r1", "r2"]);

    const gestor2 = new GestorCheckpoints(new JsonFileCheckpointStore(ruta));
    gestor2.iniciar("tarea-1");
    const recuperado = gestor2.obtenerUltimo();

    assert.ok(recuperado);
    assert.equal(recuperado.tareaId, "tarea-1");
    assert.equal(recuperado.paso, 2);
    assert.deepEqual(recuperado.resultadosParciales, ["r1", "r2"]);
    assert.ok(recuperado.timestamp instanceof Date);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("marcar completado persiste en el store durable", () => {
  const dir = mkdtempSync(join(tmpdir(), "patrones-cp-"));
  try {
    const ruta = join(dir, "checkpoints.json");
    const gestor = new GestorCheckpoints(new JsonFileCheckpointStore(ruta));
    gestor.iniciar("job");
    const cp = gestor.guardar(1, {}, ["ok"]);
    gestor.marcarCompletado(cp.id);

    const gestorReiniciado = new GestorCheckpoints(new JsonFileCheckpointStore(ruta));
    gestorReiniciado.iniciar("job");
    assert.equal(gestorReiniciado.obtenerUltimo()?.completado, true);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
