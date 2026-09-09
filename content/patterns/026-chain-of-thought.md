---
patternId: 26
slug: chain-of-thought
title: Chain of Thought
summary: Estructura tareas complejas mediante descomposición y razonamiento intermedio, distinguiendo la respuesta final de los artefactos de trabajo necesarios para resolverla.
family: reasoning
legacyGroup: 5
level: workflow
difficulty: intermediate
maturity: established
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_26_chain_of_thought.ts
tags: [reasoning, decomposition, prompting, cot]
related: [42, 55, 61, 68]
combinesWith: [4, 25, 73]
antiPatterns:
  - Tratar una explicación generada como prueba de que el proceso interno fue correcto.
  - Registrar razonamiento libre con secretos, PII o instrucciones sensibles.
  - Usar el porcentaje de confianza declarado por el modelo como probabilidad calibrada.
references:
  - Wei et al. (2022), Chain-of-Thought Prompting Elicits Reasoning in Large Language Models.
---
# Propósito
Chain of Thought (CoT) busca mejorar la resolución de tareas complejas introduciendo descomposición o pasos intermedios antes de la conclusión. La idea útil para ingeniería no es «ver la mente del modelo», sino **hacer explícitas las unidades de trabajo que el sistema necesita producir, verificar o encadenar**.

## Problema
Una respuesta directa puede saltar restricciones, mezclar subtareas o cometer errores difíciles de detectar. En problemas matemáticos, lógicos, de planificación o diagnóstico resulta útil dividir el problema y verificar productos intermedios.

## Solución
Introduce una fase de descomposición y, cuando sea apropiado, artefactos intermedios estructurados:

```text
Problema -> descomposición -> pasos/artefactos -> verificación -> respuesta
```

En sistemas modernos conviene distinguir entre:
- **razonamiento interno del modelo**, que no debe convertirse en un contrato de producto;
- **rationale breve o explicación**, diseñada para el usuario;
- **artefactos intermedios verificables**, como ecuaciones, planes, consultas, evidencias o decisiones estructuradas.

## Aplicabilidad
Úsalo cuando la tarea mejore al descomponerse y existan pasos que puedan comprobarse. Para preguntas triviales añade latencia y tokens sin beneficio claro.

## Evaluación
No evalúes solo si el texto «parece razonado». Mide exactitud final, consistencia, capacidad de verificación, coste y latencia. Un campo `confianza: 87` producido por el propio LLM no es calibración estadística.

## Seguridad y privacidad
No uses trazas de razonamiento libre como mecanismo de auditoría. Para sistemas sensibles registra decisiones, inputs, herramientas, evidencias y resultados estructurados; evita persistir contenido intermedio que pueda contener secretos o información privada.

## Implementación del repositorio
`src/pattern_26_chain_of_thought.ts` pide una salida visible con `PASO`, `CONCLUSIÓN` y `CONFIANZA`, y ofrece una variante few-shot. La implementación contiene valores de confianza por defecto/demostrativos y un parser textual sencillo; por tanto, **no debe interpretarse como un sistema de confianza calibrada ni como observabilidad fiable del razonamiento interno**.

## Mejoras para producción
1. Sustituir parsing textual por output estructurado cuando se necesiten artefactos intermedios.
2. Separar explicación para usuario de señales de control del workflow.
3. Verificar cálculos y hechos con herramientas deterministas cuando sea posible.
4. Medir el beneficio de la descomposición frente a respuesta directa.

## Relaciones
**Self-Consistency (42)** agrega varias soluciones; **Scratchpad (55)** conserva trabajo intermedio; **Few-Shot (61)** aporta ejemplos; **Zero-Shot CoT (68)** es una técnica simplificada de inducción de razonamiento.