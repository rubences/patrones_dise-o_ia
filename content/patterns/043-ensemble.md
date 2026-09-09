---
patternId: 43
slug: ensemble
title: Ensemble
summary: Combina salidas de modelos o estrategias con diversidad real para reducir dependencia de un único sistema y obtener una decisión agregada.
family: reliability
legacyGroup: 9
level: architecture
difficulty: advanced
maturity: established
llmRequired: true
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_43_ensemble.ts
tags: [ensemble, reliability, aggregation, diversity]
related: [38, 42, 73]
combinesWith: [81, 76, 92]
antiPatterns:
  - Llamar ensemble a tres prompts sobre el mismo modelo sin reconocer su correlación.
  - Interpretar solapamiento léxico como consenso semántico calibrado.
  - Ponderar expertos con pesos arbitrarios no evaluados.
references: []
---
# Propósito
Ensemble agrega sistemas con fortalezas o errores diferentes. La mejora potencial procede de la **diversidad útil**, no solo de repetir llamadas.

## Implementación del repositorio
`src/pattern_43_ensemble.ts` crea tres perfiles —Analítico, Directo y Reflexivo— usando el mismo `DEFAULT_MODEL` con distintos esfuerzos e instrucciones. Una llamada posterior sintetiza los outputs.

El indicador `acuerdo` es una heurística de intersección de palabras, no una medida calibrada de consenso. Los pesos 1.0/0.8/1.2 son demostrativos.

## Producción
Busca diversidad real de modelos, datos, herramientas o estrategias; evalúa correlación de errores; define un agregador reproducible y mide si el ensemble justifica coste y latencia extra.

## Relaciones
**Self-Consistency (42)** muestrea normalmente el mismo sistema; **MoE (38)** enruta a un subconjunto; Ensemble combina múltiples salidas.