import test from "node:test";
import assert from "node:assert/strict";
import { AIFactory } from "../../src/pattern_103_ai_factory.js";
import { GraphDrivenDevelopment } from "../../src/pattern_106_graph_driven_development.js";
import { OpenDataLakehouse } from "../../src/pattern_107_open_data_lakehouse.js";
import { GraphRAG } from "../../src/pattern_110_graphrag.js";
import { AdaptiveGraphRAGRouter } from "../../src/pattern_111_adaptive_graphrag_router.js";
import { LoRAConfig } from "../../src/pattern_115_lora.js";
import { QLoRAConfig } from "../../src/pattern_116_qlora.js";
import { RankStabilizedLoRA } from "../../src/pattern_121_rslora.js";

test("AI Factory impide promoción sin aprobación humana", () => {
  const factory = new AIFactory();
  factory.register({ id:"m1", kind:"model", version:"1", owner:"team", state:"experiment", evidence:[] });
  assert.equal(factory.evaluate("m1", [{name:"quality",pass:true}]), "validated");
  assert.throws(() => factory.promote("m1"), /human approval required/);
  factory.approve("m1", "reviewer");
  assert.equal(factory.promote("m1").state, "production");
});

test("GDD rechaza nodos y aristas fuera del esquema", () => {
  const gdd = new GraphDrivenDevelopment({ nodes:new Set(["requirement","test"]), edges:new Set(["verified-by"]) });
  gdd.addNode({id:"r1",type:"requirement"});
  gdd.addNode({id:"t1",type:"test"});
  gdd.addEdge({from:"r1",to:"t1",type:"verified-by"});
  assert.equal(gdd.impact("r1").length, 1);
  assert.throws(() => gdd.addNode({id:"x",type:"unknown"}), /invalid node type/);
  assert.throws(() => gdd.addEdge({from:"r1",to:"t1",type:"unknown"}), /invalid edge/);
});

test("Open Data Lakehouse detecta conflictos de commit optimista", () => {
  const lake = new OpenDataLakehouse();
  lake.commit({id:"s1",timestamp:1,files:["a.parquet"],schemaVersion:1});
  lake.commit({id:"s2",parent:"s1",timestamp:2,files:["b.parquet"],schemaVersion:1});
  assert.equal(lake.head()?.id, "s2");
  assert.throws(() => lake.commit({id:"s3",parent:"s1",timestamp:3,files:[],schemaVersion:1}), /commit conflict/);
});

test("GraphRAG local recupera vecinos directos", () => {
  const rag = new GraphRAG(
    [{id:"a",label:"A"},{id:"b",label:"B"},{id:"c",label:"C"}],
    [{from:"a",to:"b",predicate:"rel"}],
    {}
  );
  assert.deepEqual(rag.local("a").map(x=>x.id).sort(), ["a","b"]);
});

test("Adaptive GraphRAG enruta por complejidad", () => {
  const router = new AdaptiveGraphRAGRouter();
  assert.equal(router.route({multiHop:0,entities:1,globalIntent:0}), "dense");
  assert.equal(router.route({multiHop:1,entities:5,globalIntent:1}), "graph");
  assert.equal(router.route({multiHop:.5,entities:3,globalIntent:.4}), "hybrid");
});

test("LoRA calcula scaling y presupuesto de parámetros", () => {
  const lora = new LoRAConfig({rank:8,alpha:16,targets:["q_proj","v_proj"]});
  assert.equal(lora.scale(), 2);
  assert.equal(lora.params(4096,4096), 131072);
});

test("QLoRA rechaza anchos de cuantización fuera del contrato", () => {
  assert.throws(() => new QLoRAConfig(8, 1), /bits/);
  assert.throws(() => new QLoRAConfig(8, 16), /bits/);
  assert.equal(new QLoRAConfig(8,4).describe().bits, 4);
});

test("rsLoRA escala por raíz del rango", () => {
  const cfg = new RankStabilizedLoRA(16, 32);
  assert.equal(cfg.scale(), 8);
});
