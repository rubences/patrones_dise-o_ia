---
patternId: 29
slug: abstract-factory
title: Abstract Factory
summary: Crea familias completas y coherentes de componentes relacionados sin exponer sus clases concretas al consumidor.
family: foundations
legacyGroup: 2
level: component
difficulty: intermediate
maturity: foundational
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_29_abstract_factory.ts
tags: [gof, creational, abstract-factory, families]
related: [9, 10, 30]
combinesWith: [31, 39, 81]
antiPatterns:
  - Mezclar componentes de familias con contratos semánticos incompatibles.
  - Introducir una fábrica abstracta sin necesidad de familias coherentes.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Abstract Factory produce conjuntos relacionados de objetos. En IA una familia puede representar proveedor, nivel de seguridad, entorno o enfoque LLM-versus-rules.

## Problema
Cambiar solo un componente puede romper compatibilidad con el resto de la familia de runtime.

## Solución
El consumidor trabaja con interfaces; una fábrica concreta crea todos los componentes compatibles de una misma familia.

## Aplicabilidad
Útil para multi-provider, entornos cloud/on-prem o variantes reguladas. Evítalo si los objetos varían de forma independiente.

## Producción
Define una matriz explícita de capacidades. Dos proveedores que implementan la misma interfaz pueden no ofrecer idéntica semántica, límites o seguridad.

## Implementación del repositorio
`src/pattern_29_abstract_factory.ts` muestra familias de agentes coherentes.

## Relaciones
**Factory Method (9)** crea un producto; Abstract Factory crea familias; **Bridge (31)** desacopla dimensiones de variación.