---
patternId: 69
slug: prompt-injection-defense
title: Prompt Injection Defense
summary: Reduce el riesgo de instrucciones hostiles mediante detección, separación de confianza y controles deterministas, sin asumir que un clasificador puede resolver por sí solo la inyección de prompts.
family: safety-security
legacyGroup: 16
level: architecture
difficulty: advanced
maturity: emerging
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_69_prompt_injection_defense.ts
tags: [prompt-injection, security, detection, guardrails]
related: [53, 100, 101]
combinesWith: [72, 74, 102]
antiPatterns:
  - Tratar un detector de inyección como frontera de seguridad suficiente.
  - Considerar el system prompt un secreto que debe protegerse solo mediante instrucciones.
  - Sanitizar texto y después concederle permisos que no tenía antes.
references: []
---
# Propósito
Prompt Injection Defense intenta evitar que texto no confiable altere instrucciones de mayor prioridad o induzca acciones no autorizadas.

## Modelo de amenaza
La inyección puede llegar directamente del usuario o indirectamente desde documentos, herramientas, páginas web o memoria. La defensa robusta requiere separar **datos**, **instrucciones** y **autoridad**; clasificar texto es solo una capa.

## Implementación del repositorio
`src/pattern_69_prompt_injection_defense.ts` aplica primero regex para frases conocidas y, si no hay match fuerte, consulta al mismo LLM como meta-evaluador. El bloqueo semántico depende de `TIPO` y una `CONFIANZA` autodeclarada. La sanitización solo reemplaza los regex conocidos y el `AgenteSeguro` bloquea las entradas detectadas en lugar de procesar su versión sanitizada.

Aunque el enum incluye `indirect_injection`, esta clase analiza únicamente el string que recibe. No inspecciona automáticamente documentos RAG o salidas de tools; esa superficie se aborda mejor con el patrón 100.

## Límites
Los detectores tienen falsos positivos y falsos negativos. Una reformulación nueva puede evitar regex y un juez LLM puede ser manipulado por el mismo contenido que intenta clasificar.

## Producción
Combina separación de roles/contexto, mínimo privilegio, allowlists de tools, validación de llamadas, sanitización de datos externos y evals adversariales continuos. Las acciones sensibles deben seguir requiriendo autorización determinista aunque el detector declare la entrada segura.

## Relaciones
**Tool-Output Sanitization (100)** cubre inyección indirecta; **Access Control (72)** limita autoridad; **Tool Call Validation (101)** valida la acción concreta.