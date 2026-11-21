// Archify 3.2.0, source-vetted curated diagram registry.
export const ARCHIFY_RELEASE_SHA = "208acba8d412335185b2056fedf54b3405df43fb";
export const curatedDiagrams = Object.freeze([
  { id: "interactive-lab", type: "architecture", candidate: "diagrams/archify/interactive-lab.architecture.json", output: "interactive-lab.html" },
  { id: "pattern-001", type: "workflow", patternId: 1, slug: "pipeline", candidate: "diagrams/archify/pattern-001.workflow.json", output: "pattern-001-pipeline.html" },
  { id: "pattern-025", type: "workflow", patternId: 25, slug: "rag", candidate: "diagrams/archify/pattern-025.workflow.json", output: "pattern-025-rag.html" },
  { id: "pattern-053", type: "workflow", patternId: 53, slug: "guardrails", candidate: "diagrams/archify/pattern-053.workflow.json", output: "pattern-053-guardrails.html" },
  { id: "pattern-060", type: "workflow", patternId: 60, slug: "orchestrator-workers", candidate: "diagrams/archify/pattern-060.workflow.json", output: "pattern-060-orchestrator-workers.html" },
  { id: "pattern-082", type: "workflow", patternId: 82, slug: "mcp-server", candidate: "diagrams/archify/pattern-082.workflow.json", output: "pattern-082-mcp-server.html" }
]);
