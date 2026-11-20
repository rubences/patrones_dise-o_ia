---
patternId: 323
slug: compromised-agent-containment
title: "Compromised Agent Containment"
summary: "Contrato experimental de respuesta a incidentes y análisis forense para compromised agent containment, con trazabilidad y controles de recuperación."
family: ai-incident-forensics
legacyGroup: 51
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_323_compromised_agent_containment.ts
tags: [incident-response, forensics, agent-security]
related: [98, 149, 321]
combinesWith: [77, 124]
antiPatterns:
  - Confundir una secuencia declarativa de hashes con cadena de custodia certificada.
references: []
---

## Problema y solución

Compromised Agent Containment define un control delimitado de detección, contención, reconstrucción o recuperación ante incidentes de IA. Código: `src/pattern_323_compromised_agent_containment.ts`.

## Pruebas y límites

`tests/p12_incident_patterns.test.ts`. Los eventos y señales son externos; los contratos no aíslan procesos reales, no implementan almacenamiento inmutable ni verifican firmas de custodios.

## Evidencia

Estado `needs-review`; requiere telemetría y escenarios adversariales verificables.
