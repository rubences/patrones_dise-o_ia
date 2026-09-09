---
patternId: 100
slug: tool-output-sanitization
title: Tool-Output Sanitization
summary: Trata la salida de herramientas y fuentes externas como datos no confiables antes de reintroducirlos en el contexto del agente, preservando procedencia y limitando su capacidad de convertirse en instrucción.
family: safety-security
legacyGroup: 23
level: component
difficulty: advanced
maturity: emerging
llmRequired: false
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_100_tool_output_sanitization.ts
tags: [tool-output, indirect-injection, provenance, sanitization]
related: [69, 25, 83]
combinesWith: [72, 101, 53]
antiPatterns:
  - Confiar en delimitadores de texto como frontera de seguridad determinista.
  - Suponer que reemplazar unas pocas frases neutraliza cualquier inyección indirecta.
  - Insertar el nombre de fuente sin escapar dentro de un formato estructurado.
references: []
---
# Propósito
Tool-Output Sanitization protege el punto donde resultados externos vuelven al contexto del LLM, una superficie típica de prompt injection indirecta.

## Implementación del repositorio
`src/pattern_100_tool_output_sanitization.ts` busca cinco patrones regex, reemplaza coincidencias sospechosas y envuelve el resultado en `<untrusted_tool_data source="...">`. Esta separación de procedencia es conceptualmente correcta y complementa al patrón 69.

Sin embargo, los delimitadores siguen siendo **texto interpretado por el modelo**, no una barrera de ejecución. Un atacante puede usar formulaciones no cubiertas por regex. Además, `fuente` se interpola directamente en un atributo sin escaping; una fuente controlada externamente podría romper la estructura del delimitador.

## Producción
Conserva datos externos en canales/objetos estructurados cuando el framework lo permita, escapa metadata, aplica allowlists de contenido y nunca conviertas texto de una tool en autoridad para llamar otra tool. La autorización de acciones permanece fuera del LLM.

## Estrategia de defensa
La salida puede marcarse y resumirse, pero las acciones derivadas deben atravesar Access Control y Tool Call Validation. Para RAG, conserva además IDs y provenance de cada fragmento.

## Relaciones
**Prompt Injection Defense (69)** protege input directo; este patrón protege datos externos; **Tool Call Validation (101)** evita que una inyección se traduzca directamente en una acción mal formada.