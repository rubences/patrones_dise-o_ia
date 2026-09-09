---
patternId: 67
slug: output-parsers
title: Output Parsers
summary: Convierte texto generado en estructuras de aplicación mediante parsers explícitos cuando no existe o no puede usarse un contrato estructurado nativo.
family: reliability
legacyGroup: 10
level: component
difficulty: intermediate
maturity: established
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_67_output_parsers.ts
tags: [parsing, output, compatibility, structure]
related: [59, 11]
combinesWith: [76, 77]
antiPatterns:
  - Aceptar parsing parcial como éxito silencioso.
  - Usar regex frágiles para decisiones de alto impacto.
  - Preferir parsing libre cuando hay structured outputs disponibles.
references: []
---
# Propósito
Output Parsers ofrece adaptadores reutilizables para extraer listas, pares clave-valor, tablas o Markdown desde texto libre.

## Implementación del repositorio
`src/pattern_67_output_parsers.ts` incluye cuatro parsers heurísticos. `ListParser` puede interpretar líneas narrativas como items; `TableParser` asume una tabla Markdown convencional; `KeyValueParser` parte por el primer patrón `clave: valor`.

El objetivo es compatibilidad y fallback, no garantía de exactitud. Un resultado no nulo no demuestra que todos los datos esperados estén presentes.

## Producción
Añade validación posterior, errores explícitos, métricas de parse failure y fixtures adversariales. Usa schemas nativos para workflows críticos.

## Relaciones
**Structured Output (59)** es preferible cuando se controla la generación; Adapter (11) traduce formatos externos más generales.