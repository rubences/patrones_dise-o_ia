---
patternId: 346
slug: policy-constrained-decision-optimizer
title: "Policy-Constrained Decision Optimizer"
summary: "Contrato experimental de control operacional para Policy-Constrained Decision Optimizer; aplica validaciones deterministas y auditoría estructurada."
family: agentic-decision-control
legacyGroup: 53
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_346_policy_constrained_decision_optimizer.ts
tags: [agentic, decision-control, auditability]
related: [72, 77, 98]
combinesWith: [124, 329]
antiPatterns:
  - Confundir el gate de referencia con autorización productiva o prueba formal.
references: []
---

## Problema

Policy-Constrained Decision Optimizer aborda decisiones operativas de agentes que requieren límites verificables y trazabilidad.

## Solución de referencia

El contrato TypeScript comprueba identidad, evidencia declarada, aprobación, riesgo y presupuesto; devuelve una decisión fail-closed y un registro de auditoría. El ejemplo comparte un gate básico con otros patrones de esta macrofamilia: **no implementa todavía la semántica específica completa de Policy-Constrained Decision Optimizer**.

## Pruebas y límites

Requiere validación externa de identidad, autorización, integridad de evidencias y umbrales según el dominio. No constituye conformidad regulatoria, garantía de seguridad ni despliegue autónomo certificado.

## Evidencia

Estado `needs-review`; faltan benchmarks y fuentes primarias vinculadas al alcance específico.
