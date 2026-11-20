---
patternId: 349
slug: autonomous-action-budget-controller
title: "Autonomous Action Budget Controller"
summary: "Contrato experimental de control operacional para Autonomous Action Budget Controller; aplica validaciones deterministas y auditoría estructurada."
family: agentic-decision-control
legacyGroup: 53
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_349_autonomous_action_budget_controller.ts
tags: [agentic, decision-control, auditability]
related: [72, 77, 98]
combinesWith: [124, 329]
antiPatterns:
  - Confundir el gate de referencia con autorización productiva o prueba formal.
references: []
---

## Problema

Autonomous Action Budget Controller aborda decisiones operativas de agentes que requieren límites verificables y trazabilidad.

## Solución de referencia

El contrato TypeScript comprueba identidad, evidencia declarada, aprobación, riesgo y presupuesto; devuelve una decisión fail-closed y un registro de auditoría. El ejemplo comparte un gate básico con otros patrones de esta macrofamilia: **no implementa todavía la semántica específica completa de Autonomous Action Budget Controller**.

## Pruebas y límites

Requiere validación externa de identidad, autorización, integridad de evidencias y umbrales según el dominio. No constituye conformidad regulatoria, garantía de seguridad ni despliegue autónomo certificado.

## Evidencia

Estado `needs-review`; faltan benchmarks y fuentes primarias vinculadas al alcance específico.
