---
patternId: 302
slug: plain-language-fidelity-gate
title: "Plain Language Fidelity Gate"
summary: "Contrato experimental de accesibilidad e inclusión para plain language fidelity gate, con pruebas de compatibilidad y calidad."
family: ai-accessibility-inclusion
legacyGroup: 49
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_302_plain_language_fidelity_gate.ts
tags: [accessibility, multilingual, human-ai]
related: [98, 149, 301]
combinesWith: [77, 124]
antiPatterns:
  - Considerar metadatos de accesibilidad como certificación de conformidad WCAG.
references: []
---

## Problema y solución

Plain Language Fidelity Gate propone un control delimitado de accesibilidad, adaptación lingüística o evaluación de inclusión. Código: `src/pattern_302_plain_language_fidelity_gate.ts`.

## Pruebas y límites

`tests/p12_accessibility_patterns.test.ts`. Las comprobaciones declarativas no sustituyen ensayos con usuarios ni tecnologías de asistencia; las diferencias de rendimiento requieren revisión estadística.

## Evidencia

Estado `needs-review`; pendiente de evaluación empírica y bibliografía primaria.
