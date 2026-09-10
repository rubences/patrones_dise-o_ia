# Dossier de envío — Manual universitario (ES)

## Título de trabajo

**Patrones de Diseño en Inteligencia Artificial: Manual Práctico y Laboratorios**  
*De agentes y RAG a arquitecturas seguras, observables y desplegables*

## Propuesta en una frase

Manual universitario progresivo que convierte un catálogo real de 102 patrones de IA en prácticas reproducibles con Python, Docker, n8n y APIs LLM, incorporando evaluación, seguridad, observabilidad y rúbricas.

## Presentación editorial breve

El libro está diseñado como material docente para asignaturas de grado y máster relacionadas con Inteligencia Artificial, Ingeniería de Software, Ciberseguridad y Sistemas Distribuidos. Su aportación diferencial es evitar un enfoque centrado únicamente en prompts o demostraciones aisladas: el estudiante aprende a diseñar sistemas completos mediante patrones, a medir su comportamiento, a justificar decisiones arquitectónicas y a introducir controles de seguridad y recuperación desde el inicio. Cada módulo combina objetivos de aprendizaje, explicación conceptual, implementación guiada, laboratorio, errores frecuentes, actividades de ampliación, preguntas de reflexión y rúbrica. La obra se apoya en un repositorio abierto con 102 implementaciones TypeScript y un catálogo web, pero el manual desarrolla una narrativa pedagógica propia en Python y herramientas accesibles al alumnado. El recorrido culmina en un proyecto integrador de servicio de IA en producción.

## Público objetivo

- estudiantes de grados TIC e ingenierías;
- alumnado de máster en IA, software, datos o ciberseguridad;
- profesorado que necesite prácticas listas para adaptar a una asignatura;
- profesionales que quieran aprender arquitecturas de IA mediante ejercicios reproducibles.

## Estructura didáctica fija por módulo

1. Competencias y resultados de aprendizaje.
2. Prerrequisitos.
3. Problema que se quiere resolver.
4. Patrones implicados.
5. Explicación conceptual con diagrama propio.
6. Implementación paso a paso.
7. Laboratorio reproducible.
8. Pruebas y criterios de aceptación.
9. Fallos frecuentes y diagnóstico.
10. Seguridad, privacidad y coste cuando proceda.
11. Actividades de ampliación.
12. Autoevaluación.
13. Rúbrica docente.

## Dos capítulos muestra preparados

### Muestra 1 — Módulo 4: Tool Use y Function Calling

Demuestra desde muy pronto que el libro no enseña solo a “conectar una herramienta”. El alumnado trabaja contratos de entrada, allowlists, validación de argumentos, saneamiento de respuestas externas y autoridad mínima. Es una muestra compacta y técnicamente atractiva para una editorial de informática.

Archivo: `samples/04-tool-use-function-calling.md`.

### Muestra 2 — Módulo 5: RAG de extremo a extremo

Es una práctica muy reconocible comercialmente y permite mostrar la profundidad didáctica: ingestión, recuperación, ranking, construcción de contexto, grounding, atribución, evaluación y análisis de fallos. El objetivo no es presentar RAG como receta infalible, sino enseñar al alumno a medir cuándo falla.

Archivo: `samples/05-rag-extremo-a-extremo.md`.

## Paquete específico para RA-MA

La página pública de RA-MA consultada el 2026-09-10 pide explícitamente:

- índice completo;
- **1 o 2 capítulos**;
- extensión prevista;
- plazo previsto de finalización;
- PDF adjunto de hasta 30 MB.

El repositorio prepara dos capítulos para poder elegir. El envío inicial propuesto incluirá `INDICE_Y_LABORATORIOS.md`, esta síntesis editorial y una o las dos muestras según el tamaño y la revisión final.

### Extensión propuesta

Rango de planificación: 420–520 páginas equivalentes de manual técnico, condicionado por la maquetación de código, capturas, diagramas y rúbricas. La propuesta final expresará también una estimación aproximada de palabras para evitar depender solo del número de páginas.

### Plazo propuesto

8–10 meses desde aceptación/contrato para manuscrito completo, con posibilidad de entregar módulos revisables por bloques. Este plazo es una estimación de autor y deberá ajustarse a la planificación que acuerde la editorial.

## Paquete específico para Paraninfo

Paraninfo encaja por su línea Universidad y por publicar material de Ciencias de la Computación, libros de texto, guías profesionales y monografías. Sin embargo, las fuentes públicas revisadas no fijan un número exacto de capítulos muestra para el primer contacto. Por tanto, no se afirmará un requisito inexistente.

Propuesta de primer contacto:

- sinopsis de una página;
- público y asignaturas de destino;
- valor diferencial docente;
- índice completo;
- extensión y calendario estimados;
- breve perfil del autor;
- indicación de que existen dos módulos muestra completos disponibles.

Antes de enviar el dossier completo se confirmará con el contacto editorial el formato y material exacto que desean evaluar.

## Diferenciación frente a manuales genéricos de IA

El libro se posicionará por cinco rasgos acumulativos:

- patrón de diseño como unidad pedagógica;
- construcción de sistemas completos, no solo consumo de modelos;
- integración real de seguridad, resiliencia y observabilidad;
- laboratorios reproducibles y evaluables;
- companion web/repositorio que puede actualizar código sin reescribir el libro.

## Material complementario previsto

- repositorio de prácticas Python;
- Docker Compose por laboratorios seleccionados;
- flujos n8n exportables;
- bancos de pruebas y fixtures sin datos personales reales;
- rúbricas editables;
- soluciones para profesorado separadas del material público cuando sea necesario;
- cuestionarios y actividades de ampliación;
- mapas de correspondencia entre módulos y los 102 patrones del catálogo.

## Gate de envío

El manual estará listo para envío cuando:

- los requisitos actuales de la editorial se hayan comprobado de nuevo;
- índice, extensión y plazo sean coherentes en todos los documentos;
- los dos módulos muestra estén cerrados pedagógica y técnicamente;
- todo código de ejemplo sea reproducible desde un entorno limpio;
- ninguna captura contenga credenciales, datos personales o servicios privados;
- cada figura tenga procedencia y derechos documentados;
- la propuesta no presente este libro como traducción de la monografía inglesa;
- se haya revisado el checklist contractual y de derechos.
