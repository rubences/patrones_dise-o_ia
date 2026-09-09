---
patternId: 31
slug: bridge
title: Bridge
summary: Separa una abstracción de su implementación para que ambas dimensiones puedan evolucionar e intercambiarse de forma independiente.
family: foundations
legacyGroup: 3
level: architecture
difficulty: intermediate
maturity: foundational
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_31_bridge.ts
tags: [gof, structural, bridge, providers]
related: [11, 16, 29]
combinesWith: [39, 81, 82]
antiPatterns:
  - Crear combinaciones cartesianas de clases para cada proveedor y caso de uso.
  - Suponer equivalencia total entre implementaciones.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Bridge desacopla dos ejes que cambian por separado. En IA un eje puede ser el tipo de agente y otro el proveedor/modelo utilizado.

## Problema
Sin separación, cada combinación genera una clase o workflow específico: `ResearchOpenAI`, `ResearchAnthropic`, `SupportOpenAI`...

## Solución
La abstracción conserva una referencia a una implementación y delega operaciones de bajo nivel.

## Aplicabilidad
Úsalo cuando existan dos dimensiones ortogonales de variación. Si solo traduces una API incompatible, Adapter expresa mejor el problema.

## Producción
La interfaz puente debe capturar capacidades reales y degradación. Evita el mínimo común denominador si elimina features esenciales.

## Implementación del repositorio
`src/pattern_31_bridge.ts` desacopla lógica de negocio de proveedor LLM.

## Relaciones
**Adapter (11)** integra después del hecho; **Abstract Factory (29)** puede construir combinaciones compatibles; **Model Fallback (81)** cambia implementación en runtime.