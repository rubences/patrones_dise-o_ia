---
patternId: 33
slug: interpreter
title: Interpreter
summary: Define una gramática y un intérprete para expresar workflows o reglas de IA mediante un lenguaje pequeño y controlado.
family: foundations
legacyGroup: 4
level: architecture
difficulty: advanced
maturity: foundational
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_33_interpreter.ts
tags: [gof, behavioral, interpreter, dsl]
related: [24, 35, 82]
combinesWith: [72, 101]
antiPatterns:
  - Ejecutar DSL generado por un LLM sin validación.
  - Hacer crecer una gramática simple hasta convertirla en un lenguaje inmantenible.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Interpreter representa y evalúa expresiones de una gramática. En sistemas agénticos puede definir un DSL para workflows, políticas o composiciones de herramientas.

## Problema
Los workflows codificados directamente requieren cambios de software para cada nueva combinación, mientras que texto libre es difícil de validar.

## Solución
Diseña una sintaxis restringida, parsea a una representación interna y ejecuta solo construcciones válidas.

## Aplicabilidad
Útil para lenguajes pequeños y estables. Para gramáticas complejas considera parsers formales, motores de reglas o workflow engines.

## Seguridad
Trata el DSL como código: valida AST, permisos, recursos y límites antes de ejecutar. No uses `eval`.

## Implementación del repositorio
`src/pattern_33_interpreter.ts` demuestra un DSL sencillo para workflows.

## Relaciones
**Template Method (24)** fija estructura en código; Interpreter la expresa como lenguaje; **Tool Call Validation (101)** aporta validación de acciones.