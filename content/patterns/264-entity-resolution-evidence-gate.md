---
patternId: 264
slug: entity-resolution-evidence-gate
title: "Entity Resolution Evidence Gate"
summary: "Contrato experimental de ingeniería del conocimiento para entity resolution evidence gate, con procedencia y controles de reparación."
family: autonomous-knowledge-engineering
legacyGroup: 45
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_264_entity_resolution_evidence_gate.ts
tags: [knowledge-graph, ontology, governance]
related: [98, 149, 212]
combinesWith: [77, 124]
antiPatterns:
  - Interpretar coincidencia de alias como identidad semántica demostrada.
references: []
---

## Problema y solución

Entity Resolution Evidence Gate define un mecanismo de evolución, alineación o reparación del conocimiento. Código: `src/pattern_264_entity_resolution_evidence_gate.ts`.

## Pruebas y límites

`tests/p11_knowledge_patterns.test.ts`. La revisión ontológica y la identidad de revisores requieren procesos externos.

## Evidencia

Estado `needs-review`. Exigir validación semántica y fuentes primarias verificadas.
