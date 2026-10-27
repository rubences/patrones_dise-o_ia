# Índice didáctico y laboratorios — Manual ES

El manual transforma el catálogo técnico en una secuencia de aprendizaje. Cada módulo combina **concepto → diseño → implementación → fallo → evaluación → reflexión**.

## Módulo 1 — Pensar la IA como un sistema de patrones

**Patrones:** 1, 2, 9, 10, 13.  
**Resultado:** distinguir modelo, componente, workflow y arquitectura; justificar una selección de patrones.  
**Laboratorio:** descomponer una aplicación monolítica de asistencia IA en pipeline, estrategias y routing.  
**Evidencia:** diagrama, ADR breve y test de arquitectura.

## Módulo 2 — APIs de LLM y salidas estructuradas

**Patrones:** 28, 59, 67.  
**Resultado:** diseñar contratos de entrada/salida robustos.  
**Laboratorio:** API Python con schema JSON, validación y tratamiento de errores.  
**Evidencia:** batería de casos válidos/inválidos y análisis de fallos.

## Módulo 3 — Pipeline y Router

**Patrones:** 1, 2.  
**Resultado:** construir flujos deterministas alrededor de componentes probabilísticos.  
**Laboratorio:** clasificador de intención que enruta tres servicios y registra latencia/errores.  
**Reto:** comparar routing por regla, modelo ligero y LLM.

## Módulo 4 — Tool Use y Function Calling

**Patrones:** 5, 28, 100, 101.  
**Resultado:** invocar herramientas sin transferir autoridad implícita al modelo.  
**Laboratorio:** agente con calculadora, consulta de datos simulados y allowlist; argumentos validados con Pydantic.  
**Ataques controlados:** parámetros fuera de schema, tool inexistente y salida contaminada.

## Módulo 5 — RAG de extremo a extremo

**Patrones:** 25, 41, 52, 66, 98.  
**Resultado:** diseñar un pipeline RAG trazable.  
**Laboratorio:** indexación de un corpus docente, recuperación, ranking, construcción de contexto y respuesta con atribución.  
**Métricas:** Recall@k, precisión de citas, respuesta soportada y latencia.

## Módulo 6 — Razonamiento y bucles agénticos

**Patrones:** 3, 4, 6, 27, 54.  
**Resultado:** controlar iteración, evaluación y terminación.  
**Laboratorio:** resolución de una tarea multi-etapa con planning y evaluator, limitando pasos y presupuesto.  
**Reflexión:** cuándo un loop añade complejidad sin mejorar el resultado.

## Módulo 7 — Sistemas multiagente

**Patrones:** 7, 57, 60, 65.  
**Resultado:** diseñar delegación explícita y contratos entre agentes.  
**Laboratorio:** equipo de agentes para investigación de un caso técnico con roles y artefacto compartido.  
**Reto:** resolver la misma tarea con un único agente y comparar coste, calidad y trazabilidad.

## Módulo 8 — Memoria, caché y gestión del contexto

**Patrones:** 44, 48, 51, 86.  
**Resultado:** separar estado persistente, checkpoint, caché y compactación.  
**Laboratorio:** asistente con memoria limitada, TTL, checkpoints y resumen del contexto.  
**Métricas:** coste, pérdida de hechos, recuperación y privacidad.

## Módulo 9 — Seguridad y guardrails

**Patrones:** 53, 69, 71, 72, 84, 89, 100, 101.  
**Resultado:** aplicar defensa en profundidad alrededor del modelo.  
**Laboratorio:** entorno Docker aislado con casos de prompt injection, PII, secretos, permisos y saneamiento de herramientas.  
**Evidencia:** matriz amenaza-control y tests adversariales reproducibles.

## Módulo 10 — Fiabilidad y recuperación

**Patrones:** 45, 46, 47, 58, 81, 85, 94.  
**Resultado:** diseñar degradación controlada ante fallos.  
**Laboratorio:** servicio con proveedor LLM simulado que introduce errores, timeout y duplicados.  
**Métricas:** tasa de éxito, recuperación, duplicidad, latencia p95 y comportamiento en fallback.

## Módulo 11 — Evaluación, observabilidad y coste

**Patrones:** 73, 75, 76, 77, 78, 92.  
**Resultado:** convertir calidad, coste y regresiones en señales medibles.  
**Laboratorio:** dataset de evaluación, trazas, comparación A/B y presupuesto por caso de uso.  
**Entrega:** dashboard mínimo y decisión argumentada de promoción/no promoción.

## Módulo 12 — Proyecto integrador: servicio de IA en producción

**Patrones:** 79, 80, 88, 90, 93, 95, 96 y selección libre del resto.  
**Resultado:** componer una arquitectura completa y defender trade-offs.  
**Capstone:** servicio de IA desplegado en contenedores con conocimiento/herramientas, observabilidad, límites, canary, escalado humano y pruebas.

## Rúbrica base de laboratorio

| Dimensión | Excelente | Adecuado | Insuficiente |
|---|---|---|---|
| Diseño | Patrón justificado y límites explícitos | Solución funcional con justificación parcial | Patrón aplicado mecánicamente |
| Implementación | Reproducible, modular y testeada | Funcional con cobertura básica | Frágil o no reproducible |
| Seguridad | Amenazas relevantes y controles verificables | Controles básicos | Sin modelo de amenaza |
| Evaluación | Métricas y casos negativos | Métricas parciales | Solo demo positiva |
| Comunicación | Evidencia, ADR y conclusiones claras | Documentación suficiente | Decisiones no justificadas |

La rúbrica se especializará por módulo y podrá adaptarse al peso y competencias de cada asignatura.

## Diseño de actualizaciones

Las explicaciones estables permanecen en el libro. Versiones de SDK, endpoints, modelos, imágenes Docker, workflows n8n y soluciones se mantienen en el companion site con tags por edición. De este modo el libro conserva valor docente aunque cambie el ecosistema de herramientas.
