---
patternId: 263
slug: ontology-change-proposal-agent
title: "Ontology Change Proposal Agent"
summary: "Contrato experimental de ingeniería del conocimiento para ontology change proposal agent, con procedencia y controles de reparación."
family: autonomous-knowledge-engineering
legacyGroup: 45
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_263_ontology_change_proposal_agent.ts
tags: [knowledge-graph, ontology, governance]
related: [98, 149, 212]
combinesWith: [77, 124]
antiPatterns:
  - Interpretar coincidencia de alias como identidad semántica demostrada.
references: []
---

## Problema y solución

Ontology Change Proposal Agent define un mecanismo de evolución, alineación o reparación del conocimiento. Código: `src/pattern_263_ontology_change_proposal_agent.ts`.

## Pruebas y límites

`tests/p11_knowledge_patterns.test.ts`. La revisión ontológica y la identidad de revisores requieren procesos externos.

## Evidencia

Estado `needs-review`. Exigir validación semántica y fuentes primarias verificadas.
