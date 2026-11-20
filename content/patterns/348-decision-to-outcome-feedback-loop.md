---
patternId: 348
slug: decision-to-outcome-feedback-loop
title: "Decision-to-Outcome Feedback Loop"
summary: "Contrato experimental de control operacional para Decision-to-Outcome Feedback Loop; aplica validaciones deterministas y auditoría estructurada."
family: agentic-decision-control
legacyGroup: 53
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_348_decision_to_outcome_feedback_loop.ts
tags: [agentic, decision-control, auditability]
related: [72, 77, 98]
combinesWith: [124, 329]
antiPatterns:
  - Confundir el gate de referencia con autorización productiva o prueba formal.
references: []
---

## Problema

Decision-to-Outcome Feedback Loop aborda decisiones operativas de agentes que requieren límites verificables y trazabilidad.

## Solución de referencia

El contrato TypeScript comprueba identidad, evidencia declarada, aprobación, riesgo y presupuesto; devuelve una decisión fail-closed y un registro de auditoría. El ejemplo comparte un gate básico con otros patrones de esta macrofamilia: **no implementa todavía la semántica específica completa de Decision-to-Outcome Feedback Loop**.

## Pruebas y límites

Requiere validación externa de identidad, autorización, integridad de evidencias y umbrales según el dominio. No constituye conformidad regulatoria, garantía de seguridad ni despliegue autónomo certificado.

## Evidencia

Estado `needs-review`; faltan benchmarks y fuentes primarias vinculadas al alcance específico.
