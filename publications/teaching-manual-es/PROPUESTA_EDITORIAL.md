# Propuesta editorial — Manual universitario (ES)

## Título de trabajo

**Patrones de Diseño en Inteligencia Artificial: Manual Práctico y Laboratorios**  
*De agentes y RAG a arquitecturas seguras, observables y desplegables*

## Idea editorial

Un manual universitario para aprender ingeniería de sistemas de IA mediante patrones, prácticas reproducibles y un proyecto integrador. El objetivo no es enseñar una colección de prompts: el alumnado aprende a diseñar, implementar, probar y justificar sistemas completos con recuperación, herramientas, agentes, seguridad, resiliencia, observabilidad y control de costes.

Esta obra es independiente de la monografía de investigación en inglés. Comparte el repositorio técnico y los IDs de los patrones, pero su secuencia, narrativa, ejemplos, figuras y evaluación se construyen desde objetivos docentes.

## Público objetivo

- estudiantes de grados TIC;
- alumnado de máster en IA, ingeniería de software, ciberseguridad y sistemas distribuidos;
- docentes que necesiten prácticas reproducibles y evaluables;
- profesionales que quieran una ruta aplicada desde fundamentos hasta producción.

El material se diseña para poder reutilizarse en asignaturas de grado y posgrado y en contextos docentes como los mencionados para UCLM, Nebrija y CEU San Pablo, sin afirmar adopción institucional hasta disponer de evidencia formal de uso.

## Diferenciación

El manual se organiza por **experiencias de aprendizaje**, no por una enciclopedia de 102 capítulos. El catálogo completo permanece como referencia web; el libro selecciona composiciones de patrones para resolver problemas progresivos.

Cada módulo incluirá:

- resultados de aprendizaje;
- explicación conceptual breve;
- diagrama de arquitectura;
- laboratorio guiado;
- código base y variantes;
- preguntas de comprobación;
- ejercicio propuesto;
- errores frecuentes;
- criterios de seguridad y uso responsable;
- rúbrica de evaluación;
- ampliación opcional;
- enlaces a patrones relacionados del catálogo.

## Stack didáctico

La vía docente usará un stack accesible y reproducible:

- **Python** para los laboratorios principales;
- **Docker** para aislar servicios y facilitar la reproducibilidad;
- **n8n** para visualizar flujos y automatizaciones cuando aporte valor didáctico;
- APIs de LLM mediante adaptadores que eviten dependencia excesiva de un proveedor;
- Git/GitHub para entrega, versionado y evidencias de aprendizaje.

Los ejemplos podrán disponer de equivalentes TypeScript enlazados al repositorio, pero el alumno no necesitará dominar TypeScript para seguir el manual.

## Estructura propuesta

Doce módulos progresivos:

1. pensar la IA como sistema de patrones;
2. APIs de LLM y salidas estructuradas;
3. Pipeline y Router;
4. Tool Use y Function Calling;
5. RAG de extremo a extremo;
6. razonamiento y bucles agénticos;
7. sistemas multiagente;
8. memoria, caché y contexto;
9. seguridad y guardrails;
10. fiabilidad y recuperación;
11. evaluación, observabilidad y coste;
12. proyecto integrador en producción.

El detalle y los patrones asociados están en `publication.json` e `INDICE_Y_LABORATORIOS.md`.

## Proyecto final

El capstone plantea un servicio de IA desplegable que debe combinar al menos:

- una fuente de conocimiento o herramienta externa;
- una política de acceso;
- un mecanismo de recuperación ante fallos;
- telemetría y métricas;
- presupuesto de coste/tokens;
- escalado o aclaración humana;
- pruebas funcionales y adversariales básicas.

La entrega incluye repositorio, arquitectura, demo, memoria breve, evidencia de pruebas y defensa oral.

## Evaluación docente

Propuesta orientativa adaptable por asignatura:

- laboratorios guiados: 30 %;
- ejercicios de diseño y análisis: 20 %;
- controles breves/retos: 10 %;
- proyecto integrador: 30 %;
- defensa y reflexión técnica: 10 %.

Estos porcentajes son diseño pedagógico del libro, no una exigencia de ninguna universidad.

## Material del docente

Cuando el contrato lo permita, el companion site ofrecerá:

- soluciones de referencia separadas;
- rúbricas editables;
- bancos de preguntas;
- datasets pequeños y escenarios;
- plantillas Docker Compose;
- workflows n8n exportables;
- versiones de prácticas por dificultad;
- guía de actualización ante cambios de APIs/modelos.

## Propuesta para RA-MA / Paraninfo

Para RA-MA se preparará un paquete que pueda incluir índice detallado, extensión prevista, plazo realista y **3–4 capítulos muestra**, cubriendo tanto fundamentos como una práctica diferenciadora. Paraninfo se tratará como candidato sujeto a confirmación de encaje y requisitos editoriales vigentes antes del envío.

Capítulos muestra recomendados:

- Módulo 4 — Tool Use y Function Calling;
- Módulo 5 — RAG de extremo a extremo;
- Módulo 9 — Seguridad y guardrails;
- Módulo 12 — Proyecto integrador (extracto).

## Extensión objetivo

Plan inicial: **450–550 páginas didácticas** incluyendo figuras, prácticas, ejercicios y anexos. La cifra se ajustará con la editorial. El objetivo es que la versión impresa sea autocontenida y que los activos que envejecen rápidamente (código, APIs, dependencias) permanezcan versionados en el companion site.

## Autor

Rubén Juárez Cádiz desarrolla actividad docente y profesional en ciberseguridad, inteligencia artificial, ingeniería de software y sistemas distribuidos. El dossier final incorporará CV abreviado, experiencia docente pertinente, publicaciones/artefactos relacionados y una descripción verificable del uso del material en asignaturas cuando exista evidencia.

## Derechos y relación con la obra inglesa

Antes de firmar se aplicará `../common/EDITORIAL_REUSE_AND_RIGHTS.md`. El contrato debe preservar, en la medida negociada, la web complementaria, código, prácticas reutilizables en docencia, depósito permitido y capacidad de desarrollar la monografía EN como obra distinta.
