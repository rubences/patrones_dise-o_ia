---
patternId: 10
slug: builder
title: Builder
summary: Construye configuraciones complejas de agentes o prompts paso a paso, separando el proceso de ensamblaje de la representación final.
family: foundations
legacyGroup: 2
level: component
difficulty: beginner
maturity: foundational
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_10_builder.ts
tags: [gof, creational, builder, prompts]
related: [9, 24, 30]
combinesWith: [53, 59, 78]
antiPatterns:
  - Crear builders para objetos triviales.
  - Permitir estados parciales inválidos sin validación final.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Builder organiza la creación incremental de objetos complejos. En IA es especialmente útil para ensamblar instrucciones, herramientas, restricciones, formatos y políticas sin recurrir a constructores inmanejables.

## Problema
Un agente de producción suele necesitar muchas decisiones: modelo, rol, contexto, tools, output schema, límites, guardrails y observabilidad. Un único constructor con decenas de parámetros produce configuraciones frágiles.

## Solución
Expresa el ensamblaje como una secuencia fluida de pasos y valida al final el producto construido.

```text
Builder -> role -> context -> tools -> policies -> build()
```

## Aplicabilidad
Adecuado cuando hay muchas opciones, configuraciones reutilizables o necesidad de presets. No sustituye a un sistema de configuración declarativa cuando la configuración debe ser editable externamente.

## Riesgos
Un builder puede ocultar valores por defecto peligrosos. En producción, `build()` debería validar invariantes, incompatibilidades, tool scopes y límites de coste.

## Implementación del repositorio
`src/pattern_10_builder.ts` muestra una construcción fluida de configuración/prompt. El valor editorial está en la separación entre proceso de construcción y objeto resultante.

## Relaciones
Combina bien con **Factory Method (9)**, **Template Method (24)** y guardrails para asegurar que toda configuración final cumple mínimos obligatorios.