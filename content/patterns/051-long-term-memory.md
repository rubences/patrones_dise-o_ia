---
patternId: 51
slug: long-term-memory
title: Long-Term Memory
summary: Conserva información relevante más allá de una interacción para que un agente pueda recuperar hechos, preferencias o experiencias bajo reglas explícitas de identidad, retención y privacidad.
family: knowledge-context
legacyGroup: 12
level: architecture
difficulty: advanced
maturity: emerging
llmRequired: true
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_51_long_term_memory.ts
tags: [memory, long-term-memory, personalization, retrieval]
related: [22, 25, 55, 97]
combinesWith: [52, 77, 89]
antiPatterns:
  - Guardar toda conversación indefinidamente como memoria útil.
  - Inferir o persistir atributos sensibles sin necesidad y base legítima.
  - Mezclar memorias entre usuarios, tenants o identidades.
references: []
---
# Propósito
Long-Term Memory permite que información seleccionada sobreviva a una sesión y pueda recuperarse posteriormente. La memoria útil no es «guardar todo»: es un sistema de **selección, almacenamiento, recuperación, actualización y olvido**.

## Problema
Un agente sin memoria debe reconstruir contexto en cada sesión. Sin embargo, persistir indiscriminadamente conversaciones crea ruido, problemas de privacidad y riesgo de usar información obsoleta.

## Solución
Una memoria de producción necesita un lifecycle:

```text
interaction
 -> candidate memory
 -> policy / consent / classification
 -> store with provenance + expiry
 -> retrieve for new task
 -> validate relevance/freshness
 -> use
 -> update / expire / delete
```

## Tipos de memoria
Conviene distinguir, al menos:
- hechos explícitos aportados por el usuario;
- preferencias explícitas;
- historial operativo relevante;
- estado de tareas;
- inferencias, que requieren un tratamiento mucho más restrictivo.

## Privacidad y control
La identidad y el ámbito son parte del patrón. Toda memoria debe estar asociada al sujeto/tenant correcto y contar con políticas de retención, borrado, exportación y acceso. No debe almacenarse un atributo sensible solo porque pueda inferirse de una conversación.

## Implementación del repositorio
`src/pattern_51_long_term_memory.ts` usa un array **en memoria del proceso**, con hasta 1.000 recuerdos y scoring léxico basado en coincidencias, relevancia y número de accesos. Inicializa varias memorias de ejemplo y añade al historial la consulta actual.

Aunque la clase se denomina Long-Term Memory, la implementación actual **no persiste entre reinicios ni sesiones reales**. Es una demostración del API conceptual de guardar/recuperar, no una memoria durable.

## Limitaciones de la demo
- IDs basados en `Date.now()` + aleatoriedad;
- no hay aislamiento persistente multiusuario;
- no hay consentimiento, TTL, borrado ni cifrado;
- el acceso frecuente aumenta relevancia, pudiendo reforzar información incorrecta;
- no hay provenance ni confidence por fuente.

## Producción
Usa almacenamiento durable, namespaces estrictos, provenance, timestamps, expiración, controles de acceso y mecanismos para corregir/eliminar memorias. Evalúa precision/recall de recuperación y el efecto real de la memoria en la tarea.

## Relaciones
**Memento (22)** restaura snapshots; **Scratchpad (55)** es memoria temporal; **Preference Learning (97)** aprende preferencias; Long-Term Memory gestiona información persistente recuperable.