# Paquete de evaluación editorial — RA-MA

**Fecha de preparación:** 2026-09-10  
**Estado:** borrador específico para RA-MA, preparado conforme a los requisitos públicos revisados el 2026-09-10.

## Título

**Patrones de Diseño en Inteligencia Artificial: Manual Práctico y Laboratorios**

## Subtítulo

**De agentes y RAG a arquitecturas seguras, observables y desplegables**

## Mensaje de presentación

Presento para valoración editorial un manual universitario y profesional orientado a enseñar el diseño, implementación, prueba y evaluación de sistemas contemporáneos de inteligencia artificial mediante patrones reutilizables.

La obra está concebida para asignaturas de grado y posgrado en Inteligencia Artificial, Ingeniería Informática, Ingeniería de Software, Ciberseguridad y Sistemas Distribuidos. En lugar de centrarse únicamente en prompting o en una plataforma concreta, organiza el aprendizaje desde APIs y contratos hasta RAG, agentes, sistemas multiagente, memoria, seguridad, resiliencia, observabilidad y despliegue. Cada módulo integra objetivos de aprendizaje, explicación conceptual, implementación en Python, laboratorio reproducible, escenarios de fallo, pruebas y rúbrica.

El libro se apoya en un companion site y repositorio abierto con un catálogo técnico de 102 patrones. El texto docente es una obra propia e independiente: utiliza ese catálogo como referencia, pero aporta secuencia pedagógica, prácticas, evaluación y casos específicamente diseñados para formación universitaria.

## Público y encaje académico

Público principal:

- estudiantes de grados en Informática, IA, Ciencia de Datos y titulaciones TIC;
- estudiantes de máster en IA, Ingeniería de Software, Ciberseguridad y sistemas inteligentes;
- docentes que necesiten material práctico estructurado y evaluable;
- profesionales técnicos que quieran evolucionar desde el uso de LLM hacia el diseño de sistemas completos.

Asignaturas donde puede utilizarse total o parcialmente:

- Inteligencia Artificial;
- Ingeniería de Software;
- Arquitectura de Software;
- Sistemas Distribuidos;
- Ciberseguridad;
- Desarrollo de aplicaciones con IA;
- Big Data / sistemas inteligentes;
- asignaturas de proyectos o laboratorios de máster.

## Propuesta de valor

La oferta española ya contiene manuales valiosos sobre ChatGPT, OpenAI, IA generativa y productividad. Esta obra se diferencia porque el objeto de aprendizaje no es una herramienta concreta: es la **arquitectura de sistemas de IA mediante patrones de diseño**.

El estudiante no solo aprende a obtener una respuesta de un modelo. Aprende a:

- diseñar pipelines y routers;
- utilizar herramientas con contratos y políticas;
- construir y evaluar RAG;
- crear bucles agénticos con criterios de terminación;
- coordinar múltiples agentes cuando existe una justificación arquitectónica;
- proteger secretos, PII, tools y ejecución;
- aplicar retry, circuit breaker, fallback e idempotencia;
- instrumentar latencia, tokens, coste y calidad;
- desplegar un proyecto integrador y defender las decisiones adoptadas.

## Índice completo

### Módulo 1. Pensar la IA como un sistema de patrones

Modelo, aplicación y arquitectura. Problemas recurrentes. Cómo leer un patrón. Pipeline, Router, Factory, Builder y Strategy como vocabulario inicial. Práctica diagnóstica.

### Módulo 2. APIs de LLM y salidas estructuradas

Contratos de entrada/salida. Function Calling, Structured Output y Output Parsers. Gestión de errores. Primeros tests automáticos.

### Módulo 3. Pipeline y Router

Composición determinista, routing por intención, clasificación, fallback, medición de errores y latencia.

### Módulo 4. Tool Use y Function Calling

Herramientas, allowlists, validación de argumentos, efectos laterales, confirmación, saneamiento de resultados y auditoría.

### Módulo 5. RAG de extremo a extremo

Ingesta, chunking, retrieval, ranking, contexto, grounding, atribución, evaluación, contexto obsoleto y fallos de evidencia.

### Módulo 6. Razonamiento y bucles agénticos

Planning, Reflection, Evaluator–Optimizer, Agentic Loop y ReAct. Límites de iteración y criterios de parada.

### Módulo 7. Sistemas multiagente

Delegación, Orchestrator–Workers, Agent Registry, contratos entre agentes, conflictos y costes de coordinación.

### Módulo 8. Memoria, caché y gestión del contexto

Long-Term Memory, Semantic Cache, Checkpointing y Context Compaction. Privacidad, caducidad y coste.

### Módulo 9. Seguridad y guardrails

Prompt Injection Defense, Secret Detection, Access Control, Sandboxing, PII Redaction, Tool Output Sanitization y Tool Call Validation. Cyberlab defensivo.

### Módulo 10. Fiabilidad y recuperación

Circuit Breaker, Bulkhead, Retry/Backoff, Rollback, Model Fallback, Idempotency Keys y Health Check. Inyección controlada de fallos.

### Módulo 11. Evaluación, observabilidad y coste

LLM-as-Judge, A/B Testing, Regression Testing, Observability, Token Budget y Cost Attribution. Métricas y trazas.

### Módulo 12. Proyecto integrador: servicio de IA en producción

Streaming, Rate Limiting, Batching, Canary Release, Speculative Execution, Human Escalation y Clarification Loop. Proyecto por equipos, defensa y retrospectiva.

## Capítulos que se adjuntarán

RA-MA solicita públicamente **uno o dos capítulos**. Se preparan dos para maximizar la capacidad de evaluación:

1. **Módulo 4 — Tool Use y Function Calling.** Demuestra arquitectura segura, código Python, pruebas adversariales y rúbrica.
2. **Módulo 5 — RAG de extremo a extremo.** Demuestra un caso de alta demanda con recuperación, grounding, atribución y evaluación reproducible.

La versión PDF final incorporará ambos salvo que una última revisión de extensión o enfoque aconseje enviar solo el más representativo.

## Extensión prevista

Plan editorial de autor:

- **420–520 páginas equivalentes** en formato técnico de 17 × 24 cm, condicionado por maquetación, código, diagramas y tablas;
- aproximadamente **115.000–145.000 palabras** como rango de trabajo antes de edición y composición;
- 12 módulos más introducción, anexos, bibliografía y material complementario;
- aproximadamente 80–120 diagramas, tablas, capturas didácticas y esquemas propios.

Estos valores son estimaciones para evaluación comercial y se ajustarían con el editor antes de contrato.

## Plazo de finalización

**8–10 meses desde aceptación/contrato**, con entregas internas por bloques para facilitar revisión editorial:

- meses 1–2: módulos 1–3 y normalización del entorno docente;
- meses 3–4: módulos 4–6;
- meses 5–6: módulos 7–9;
- meses 7–8: módulos 10–12 y capstone;
- meses 9–10: revisión integral, actualización tecnológica, figuras, índices y material complementario.

## Metodología docente

Cada módulo mantiene una estructura estable:

1. resultados de aprendizaje;
2. prerrequisitos;
3. problema;
4. patrones implicados;
5. arquitectura y diagrama;
6. implementación paso a paso;
7. laboratorio;
8. tests y criterios de aceptación;
9. fallos frecuentes;
10. seguridad/privacidad/coste cuando corresponda;
11. ampliaciones;
12. autoevaluación;
13. rúbrica.

## Tecnologías

El texto prioriza conceptos transferibles y evita quedar bloqueado por un proveedor. El stack práctico de referencia será:

- Python;
- Docker / Docker Compose;
- n8n cuando el workflow visual aporte valor pedagógico;
- APIs de modelos desacopladas mediante adaptadores;
- Git/GitHub para entrega y reproducibilidad;
- herramientas locales o simuladas para que los tests básicos no dependan de saldo de API.

Las versiones concretas se mantendrán en el companion site para reducir obsolescencia del libro impreso.

## Material complementario

Se prevé ofrecer:

- repositorio de prácticas;
- ficheros Docker Compose;
- flujos n8n exportables;
- fixtures y datasets sintéticos/públicos;
- tests automáticos;
- rúbricas editables;
- ejercicios de ampliación;
- material de apoyo al profesorado cuando proceda;
- enlaces desde el companion site a cada uno de los 102 patrones.

## Autor

Rubén Juárez Cádiz desarrolla actividad docente, investigadora y profesional en ciberseguridad, inteligencia artificial, sistemas distribuidos e ingeniería de software. El perfil definitivo para RA-MA incluirá las afiliaciones vigentes en la fecha de envío, experiencia docente relevante, producción científica seleccionada y datos de identificación académica.

## Análisis competitivo resumido

Los títulos actuales de RA-MA cubren ya ChatGPT/OpenAI, IA generativa aplicada a ingeniería, productividad y cursos prácticos. El hueco de este proyecto es diferente: **manual universitario de ingeniería de sistemas de IA mediante patrones, laboratorios, seguridad, resiliencia, observabilidad y evaluación**. El análisis completo se mantiene en `COMPETING_TITLES_2026.md`.

## Estado del material

- índice: completo a nivel de módulos y objetivos;
- propuesta editorial: disponible;
- capítulos muestra: dos borradores completos;
- companion técnico: operativo con 102 patrones;
- validación automática: integrada en CI;
- manuscrito completo: en desarrollo tras fase de adquisición editorial.

## Requisitos públicos RA-MA que cubre este paquete

Según la página oficial de manuscritos revisada el 2026-09-10:

- [x] índice completo;
- [x] 1 o 2 capítulos;
- [x] información sobre extensión;
- [x] plazo de finalización;
- [ ] generación del **PDF final <= 30 MB** a partir de este paquete y las muestras;
- [ ] revisión final de datos personales/contacto antes de cargar el formulario.

Fuente: https://www.ra-ma.es/manuscrito/

## Texto breve para el campo “Mensaje” del formulario

> Estimado equipo editorial: les remito para valoración el proyecto *Patrones de Diseño en Inteligencia Artificial: Manual Práctico y Laboratorios*, concebido como manual universitario para grado y posgrado en áreas TIC. La propuesta combina arquitectura de IA, Python, Docker y laboratorios reproducibles sobre APIs LLM, RAG, agentes, seguridad, fiabilidad y observabilidad. Adjunto índice completo, información de extensión/plazo y dos capítulos muestra. El proyecto dispone además de un companion web y repositorio técnico con 102 patrones. Quedo a su disposición para adaptar extensión, enfoque y calendario a sus criterios editoriales.

Antes del envío real se sustituirá este texto solo si el formulario o el editor publican instrucciones nuevas.
