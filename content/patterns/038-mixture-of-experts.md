---
patternId: 38
slug: mixture-of-experts
title: Mixture of Experts
summary: Enruta una entrada hacia un subconjunto de especialistas y combina sus aportes para asignar capacidad solo donde aporta valor.
family: agentic-workflows
legacyGroup: 8
level: architecture
difficulty: advanced
maturity: established
llmRequired: true
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_38_mixture_of_experts.ts
tags: [routing, experts, specialization, moe]
related: [2, 7, 39]
combinesWith: [43, 60, 73]
antiPatterns:
  - Presentar un ensemble de prompts sobre el mismo modelo como equivalente a un MoE neuronal entrenado.
  - Confiar en scores del router sin evaluación de routing accuracy.
  - Activar más expertos sin medir coste marginal.
references: []
---
# Propósito
Mixture of Experts distribuye una tarea entre especialistas y activa solo los más relevantes. En arquitectura de agentes, el patrón puede aplicarse a agentes, modelos o políticas especializadas; no debe confundirse automáticamente con las capas MoE internas de ciertos modelos neuronales.

## Flujo
```text
input -> gate/router -> top-k experts -> aggregation -> output
```

## Implementación del repositorio
`src/pattern_38_mixture_of_experts.ts` define cinco expertos como roles de prompting sobre el mismo cliente/modelo. Un LLM asigna scores textuales, se activan los top-K, responden en paralelo y un último LLM sintetiza.

Por tanto, la demo representa **routing hacia especialistas lógicos**, no un MoE neuronal con parámetros expertos distintos. Los scores 0–100 tampoco están calibrados.

## Producción
Evalúa routing accuracy, cobertura de dominio, coste/latencia, diversidad real entre expertos y calidad de la agregación. Define fallback cuando ningún experto supera un umbral fiable y evita que todos compartan el mismo error sistemático.

## Relaciones
**Router (2)** selecciona un destino; **Ensemble (43)** combina varias salidas; **Orchestrator-Workers (60)** coordina especialistas con tareas explícitas.