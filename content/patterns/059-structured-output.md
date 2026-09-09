---
patternId: 59
slug: structured-output
title: Structured Output
summary: Valida salidas de modelo contra un contrato tipado antes de permitir que otros componentes las utilicen como datos o decisiones.
family: reliability
legacyGroup: 13
level: component
difficulty: intermediate
maturity: established
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_59_structured_output.ts
tags: [structured-output, schema, validation, zod]
related: [28, 67, 101]
combinesWith: [20, 53, 76]
antiPatterns:
  - Confundir JSON sintácticamente válido con datos semánticamente correctos.
  - Prometer cero errores de parsing sin usar enforcement real del proveedor.
  - Pasar un objeto validado a una acción sensible sin policy adicional.
references: []
---
# Propósito
Structured Output convierte la salida generativa en un contrato consumible y valida tipos, enums, mínimos y estructura antes de continuar.

## Implementación del repositorio
`src/pattern_59_structured_output.ts` usa Zod para validar el JSON, pero el modelo recibe una instrucción textual y la respuesta se extrae con regex/`JSON.parse`. El método `describir()` no serializa realmente el schema Zod completo, porque `schema.description` suele no contener esa estructura.

Por tanto, la demo implementa **validación posterior con autocorrección**, no structured output nativo garantizado por el proveedor. El campo `confianza` de ejemplo sigue siendo autodeclarado por el modelo.

## Producción
Prefiere schema enforcement nativo cuando esté disponible, valida también semántica e invariantes de negocio y conserva errores estructurados para retry controlado.

## Relaciones
**Output Parsers (67)** transforman texto libre; Structured Output intenta imponer el contrato desde el principio.