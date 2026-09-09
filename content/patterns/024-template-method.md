---
patternId: 24
slug: template-method
title: Template Method
summary: Define el esqueleto estable de un algoritmo y permite personalizar pasos concretos sin alterar el orden y las invariantes del proceso.
family: foundations
legacyGroup: 4
level: workflow
difficulty: intermediate
maturity: foundational
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_24_template_method.ts
tags: [gof, behavioral, template-method, workflow]
related: [13, 14, 33]
combinesWith: [53, 59, 76]
antiPatterns:
  - Forzar workflows muy distintos dentro de una plantilla rígida.
  - Permitir hooks que salten invariantes de seguridad.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Template Method fija una secuencia de alto nivel y delega algunos pasos a subclases o callbacks. En IA permite imponer etapas obligatorias como validar, generar, verificar y publicar.

## Problema
Varios casos de uso comparten proceso, pero difieren en determinadas operaciones. Copiar el workflow produce divergencias.

## Solución
Define el algoritmo base una vez y marca puntos de extensión controlados.

```text
prepare -> generate* -> validate -> publish*
```

## Aplicabilidad
Útil cuando el orden y ciertas invariantes deben ser iguales. Si el orden también debe variar, Strategy o un workflow declarativo resultan más flexibles.

## Seguridad
Los pasos críticos no deberían ser hooks opcionales. Separa extensiones de invariantes obligatorias.

## Implementación del repositorio
`src/pattern_24_template_method.ts` demuestra un algoritmo común con pasos personalizables.

## Relaciones
**Strategy (13)** intercambia un algoritmo completo; **Chain (14)** permite detención/delegación; **Interpreter (33)** puede definir workflows declarativos.