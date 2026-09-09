---
patternId: 15
slug: singleton
title: Singleton
summary: Garantiza una única instancia lógica de un recurso compartido y proporciona un punto controlado de acceso a ella.
family: foundations
legacyGroup: 3
level: code
difficulty: beginner
maturity: foundational
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_15_singleton.ts
tags: [gof, creational, singleton, shared-resource]
related: [9, 32, 65]
combinesWith: [77, 80, 94]
antiPatterns:
  - Convertir estado global mutable en dependencia invisible.
  - Asumir que singleton de proceso equivale a singleton distribuido.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Singleton restringe una clase a una instancia lógica. En IA puede utilizarse para clientes compartidos, registros o pools costosos.

## Problema
Crear repetidamente recursos pesados aumenta conexiones, memoria y configuración duplicada. Pero exponerlos como globales libres dificulta test y aislamiento.

## Solución
Centraliza creación y acceso a una única instancia dentro del ámbito definido.

## Advertencia distribuida
En serverless, workers o Kubernetes, cada proceso puede tener su propio singleton. Si necesitas unicidad global, usa coordinación externa, no este patrón.

## Testabilidad
Prefiere inyección explícita en consumidores y reserva Singleton para lifecycle del recurso. Un singleton no debería ser un service locator encubierto.

## Implementación del repositorio
`src/pattern_15_singleton.ts` ilustra una instancia global compartida.

## Relaciones
**Flyweight (32)** comparte estado entre muchos objetos; **Factory (9)** centraliza creación sin imponer una sola instancia.