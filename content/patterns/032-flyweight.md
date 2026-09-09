---
patternId: 32
slug: flyweight
title: Flyweight
summary: Comparte estado intrínseco inmutable entre muchas instancias para reducir duplicación de memoria, configuración o contexto repetido.
family: foundations
legacyGroup: 3
level: code
difficulty: intermediate
maturity: foundational
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_32_flyweight.ts
tags: [gof, structural, flyweight, optimization]
related: [15, 30, 48]
combinesWith: [49, 78, 88]
antiPatterns:
  - Compartir estado mutable específico del usuario.
  - Afirmar ahorro de tokens sin medir cómo el proveedor factura o cachea contexto.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Flyweight comparte la parte estable de muchos objetos y mantiene fuera el estado extrínseco. En IA puede reutilizar configuraciones, instrucciones o estructuras comunes.

## Problema
Miles de agentes similares pueden duplicar grandes objetos o configuraciones idénticas.

## Solución
Extrae estado intrínseco compartible en una factoría/pool y pasa el estado específico en cada operación.

## Aplicabilidad
Es útil cuando hay muchas instancias y duplicación medible. No presupongas que compartir un string en memoria reduce automáticamente tokens facturados por API.

## Privacidad
Nunca conviertas conversación, PII o estado de tenant en flyweight compartido.

## Implementación del repositorio
`src/pattern_32_flyweight.ts` verifica identidad compartida de objetos de configuración.

## Relaciones
**Singleton (15)** impone una instancia; Flyweight comparte muchas referencias; **Semantic Cache (48)** reutiliza resultados, no objetos.