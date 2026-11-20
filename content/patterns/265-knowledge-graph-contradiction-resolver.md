---
patternId: 265
slug: knowledge-graph-contradiction-resolver
title: "Knowledge Graph Contradiction Resolver"
summary: "Contrato experimental de ingeniería del conocimiento para knowledge graph contradiction resolver, con procedencia y controles de reparación."
family: autonomous-knowledge-engineering
legacyGroup: 45
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_265_knowledge_graph_contradiction_resolver.ts
tags: [knowledge-graph, ontology, governance]
related: [98, 149, 212]
combinesWith: [77, 124]
antiPatterns:
  - Interpretar coincidencia de alias como identidad semántica demostrada.
references: []
---

## Problema y solución

Knowledge Graph Contradiction Resolver define un mecanismo de evolución, alineación o reparación del conocimiento. Código: `src/pattern_265_knowledge_graph_contradiction_resolver.ts`.

## Pruebas y límites

`tests/p11_knowledge_patterns.test.ts`. La revisión ontológica y la identidad de revisores requieren procesos externos.

## Evidencia

Estado `needs-review`. Exigir validación semántica y fuentes primarias verificadas.
