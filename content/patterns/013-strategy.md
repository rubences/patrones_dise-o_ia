---
patternId: 13
slug: strategy
title: Strategy
summary: Encapsula algoritmos o políticas intercambiables detrás de un contrato común para seleccionar dinámicamente cómo resolver una tarea de IA.
family: foundations
legacyGroup: 3
level: component
difficulty: beginner
maturity: foundational
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_13_strategy.ts
tags: [gof, behavioral, strategy, policy]
related: [2, 29, 39]
combinesWith: [41, 48, 61]
antiPatterns:
  - Codificar una cascada de if/else para cada algoritmo.
  - Permitir que las estrategias rompan el contrato común.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Strategy permite variar el algoritmo sin variar el consumidor. En IA puede representar prompting, retrieval, ranking, selección de modelo o políticas de generación.

## Problema
Un workflow con múltiples formas de resolver la misma etapa se vuelve rígido si cada variante está embebida en condicionales.

## Solución
Define una interfaz estable y una estrategia concreta por algoritmo. El contexto selecciona una estrategia y delega.

```text
Context -> Strategy interface -> Strategy A / B / C
```

## Aplicabilidad
Adecuado cuando las alternativas comparten propósito y contrato. Si las variantes cambian todo el workflow, puede corresponder más a Router, Template Method o Branching.

## Evaluación
La selección de estrategia debe medirse: calidad, coste, latencia y tasa de fallos. No elijas una estrategia por intuición si puede evaluarse offline u online.

## Implementación del repositorio
`src/pattern_13_strategy.ts` ilustra estrategias intercambiables de procesamiento/prompting.

## Relaciones
**Router (2)** decide destino; **Factory (9/29)** puede construir estrategias; **A/B Testing (75)** compara su rendimiento.