---
patternId: 30
slug: prototype
title: Prototype
summary: Crea nuevas configuraciones clonando una instancia base ya preparada y modificando únicamente las diferencias necesarias.
family: foundations
legacyGroup: 2
level: code
difficulty: beginner
maturity: foundational
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_30_prototype.ts
tags: [gof, creational, prototype, clone]
related: [9, 10, 32]
combinesWith: [64, 97]
antiPatterns:
  - Clonar referencias mutables compartidas accidentalmente.
  - Usar clonación para evitar modelar configuración explícita.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Prototype crea objetos a partir de ejemplares configurados. En IA permite derivar un agente especializado desde una configuración base afinada.

## Problema
Reconstruir desde cero configuraciones extensas es costoso y favorece inconsistencias.

## Solución
Clona un prototipo y aplica overrides explícitos.

## Aplicabilidad
Adecuado para presets, experimentos o variantes de persona. Decide si la copia es profunda o superficial y qué estado nunca debe clonarse.

## Seguridad
No clones credenciales efímeras, conversaciones privadas o identificadores de tenant. Separa configuración clonable de estado operativo.

## Implementación del repositorio
`src/pattern_30_prototype.ts` demuestra clonación de configuraciones.

## Relaciones
**Builder (10)** ensambla; **Factory (9)** decide qué crear; **Flyweight (32)** comparte en vez de copiar.