---
patternId: 92
slug: cost-attribution
title: Cost Attribution
summary: Atribuye consumo y coste a tenants, features o workflows para convertir gasto agregado de IA en señales accionables de FinOps y chargeback.
family: production-finops
legacyGroup: 21
level: architecture
difficulty: intermediate
maturity: established
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_92_cost_attribution.ts
tags: [finops, cost, chargeback, tenant]
related: [78, 77]
combinesWith: [48, 39, 88]
antiPatterns:
  - Hardcodear precios y usarlos indefinidamente como facturación real.
  - Ignorar costes de tools, embeddings, almacenamiento o retries.
  - Registrar tenant sin controles de integridad.
references: []
---
# Propósito
Cost Attribution crea un ledger que relaciona uso técnico con una unidad económica responsable.

## Implementación del repositorio
`src/pattern_92_cost_attribution.ts` calcula USD a partir de precios manuales por mil tokens y almacena registros en memoria. Los valores de precio son datos de demo, no precios actuales garantizados.

Solo contempla input/output tokens; no incorpora cache discounts, tool calls, imágenes, almacenamiento, embeddings o costes de infraestructura.

## Producción
Ingiere usage real, pricing versionado por modelo/fecha, moneda y descuentos. Usa ledger durable y reconciliación con factura del proveedor.

## Relaciones
**Token Budget (78)** controla en runtime; Cost Attribution analiza y factura después.