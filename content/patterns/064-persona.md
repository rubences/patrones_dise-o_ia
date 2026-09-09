---
patternId: 64
slug: persona
title: Persona
summary: Mantiene una voz, rol y marco de expertise coherentes para adaptar la experiencia de usuario sin confundir estilo conversacional con identidad, autorización o política.
family: human-experience
legacyGroup: 15
level: component
difficulty: beginner
maturity: established
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_64_persona.ts
tags: [persona, ux, tone, role]
related: [6, 51, 97]
combinesWith: [53, 72, 96]
antiPatterns:
  - Usar una persona como mecanismo de control de acceso o seguridad.
  - Inventar credenciales profesionales o experiencia real para ganar autoridad.
  - Hacer que el estilo impida declarar incertidumbre o límites.
references: []
---
# Propósito
Persona configura tono, estilo, rol y preferencias comunicativas para ofrecer una experiencia consistente y adecuada al contexto.

## Implementación del repositorio
`src/pattern_64_persona.ts` construye un prompt con nombre, descripción, personalidad, expertise, tono, limitaciones y frases características. Mantiene un historial local y envía solo las últimas cuatro entradas de conversación.

Las `limitaciones` son **instrucciones blandas dentro del prompt**. Por ejemplo, indicar que una persona no debe abordar un tema no impone un control determinista. Tampoco existe verificación automática de consistencia de estilo.

Una persona de ejemplo afirma tener `20 años de experiencia`; en un producto real estas biografías no deberían inducir a creer que el sistema posee credenciales humanas que no tiene.

## Producción
Separa personalidad de políticas. Versiona la configuración de tono, evalúa consistencia y accesibilidad, y deja que guardrails/autorización controlen lo que puede hacerse. Evita antropomorfismo engañoso en dominios sensibles.

## Relaciones
**Long-Term Memory (51)** puede recordar preferencias; **Preference Learning (97)** adapta estilo; Persona define el marco de presentación actual.