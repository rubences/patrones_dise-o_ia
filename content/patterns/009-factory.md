---
patternId: 9
slug: factory
title: Factory Method
summary: Encapsula la creación de agentes o componentes especializados detrás de una interfaz común para desacoplar selección e implementación.
family: foundations
legacyGroup: 2
level: component
difficulty: beginner
maturity: foundational
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_9_factory.ts
tags: [gof, creational, factory, agents]
related: [10, 29, 30]
combinesWith: [2, 7, 65]
antiPatterns:
  - Instanciar tipos concretos de agente por todo el código cliente.
  - Usar una fábrica cuando solo existe una implementación estable.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Factory Method desplaza la decisión de qué objeto crear a una operación especializada. En sistemas de IA permite solicitar un agente por capacidad o rol sin acoplar el flujo a una clase concreta, proveedor o configuración.

## Problema
Cuando cada workflow conoce cómo construir cada especialista, cambiar modelos, instrucciones, dependencias o políticas obliga a modificar múltiples consumidores. La lógica de negocio termina mezclada con la lógica de construcción.

## Solución
Define un contrato común y centraliza la selección del creador. El consumidor pide una capacidad; la fábrica decide la implementación y devuelve un objeto compatible.

```text
Necesidad -> Factory -> Agente concreto -> contrato común
```

## Aplicabilidad
Úsalo cuando existan varias implementaciones intercambiables, la selección dependa del contexto o quieras aislar configuración y creación. Evítalo si solo añade una capa sin variabilidad real.

## IA y producción
La fábrica puede incorporar selección de modelo, política de seguridad, presupuesto, región o tenant. No debe convertirse en un contenedor global con lógica arbitraria: la decisión debe ser observable y testeable.

## Implementación del repositorio
`src/pattern_9_factory.ts` demuestra la creación de especialistas bajo una interfaz común. La ficha describe el patrón general; la demo no implica que una fábrica resuelva por sí sola routing, autorización o lifecycle.

## Relaciones
Factory Method se complementa con **Abstract Factory (29)** para familias coherentes, **Builder (10)** para construcción incremental y **Prototype (30)** para clonación de configuraciones.