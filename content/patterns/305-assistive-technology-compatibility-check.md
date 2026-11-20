---
patternId: 305
slug: assistive-technology-compatibility-check
title: "Assistive Technology Compatibility Check"
summary: "Contrato experimental de accesibilidad e inclusión para assistive technology compatibility check, con pruebas de compatibilidad y calidad."
family: ai-accessibility-inclusion
legacyGroup: 49
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_305_assistive_technology_compatibility_check.ts
tags: [accessibility, multilingual, human-ai]
related: [98, 149, 301]
combinesWith: [77, 124]
antiPatterns:
  - Considerar metadatos de accesibilidad como certificación de conformidad WCAG.
references: []
---

## Problema y solución

Assistive Technology Compatibility Check propone un control delimitado de accesibilidad, adaptación lingüística o evaluación de inclusión. Código: `src/pattern_305_assistive_technology_compatibility_check.ts`.

## Pruebas y límites

`tests/p12_accessibility_patterns.test.ts`. Las comprobaciones declarativas no sustituyen ensayos con usuarios ni tecnologías de asistencia; las diferencias de rendimiento requieren revisión estadística.

## Evidencia

Estado `needs-review`; pendiente de evaluación empírica y bibliografía primaria.
