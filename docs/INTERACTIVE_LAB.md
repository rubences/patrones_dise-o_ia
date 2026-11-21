# Interactive Lab — Phase 1

Status: implementation candidate on feature branch, pending GitHub CI verification.

The pattern detail pages render an interactive SVG **relationship map** using canonical `related` and `combinesWith` frontmatter. This is not an execution graph or simulation. Users can inspect nodes with mouse or keyboard (Tab, Enter/Space, arrow keys), zoom with buttons and use an accessible text list when JavaScript is unavailable. All text is rendered as text, not untrusted HTML.

The pure graph builder lives in `web/src/lib/lab/pattern-graph.ts`; the Astro viewer is `web/src/components/lab/PatternDiagram.astro`. No accounts, backend or external runtime calls are used. The page retains all original Markdown and source-code links.

Run graph tests: `node --experimental-strip-types --test tests/interactive-lab-pattern-graph.test.mjs` (Node 24 in CI).

Run the full site build: `cd web && npm install && npm run build`.

Limits: Graph nodes use a simple radial layout; large relationship sets may need a more advanced layout. Curated pattern-specific execution diagrams, drag-and-drop composition, simulation, IndexedDB persistence and exports belong to later phases.

## Integración con Archify 3.2.0

La nueva capa Archify convive con el SVG de relaciones de la fase 1. Se generan **diagramas curados** desde JSON conforme a los esquemas oficiales (`architecture` y `workflow`), incluyendo referencias al repositorio y al commit compilado. Los artefactos HTML pasan por `finalize` (validación estructural, entrega y comprobación automatizada en navegador) antes de copiarse al directorio distribuible de la web.

El visor Astro utiliza un `iframe` aislado con enlace de apertura independiente, y conserva el contenido textual de la ficha. Primeros diagramas: arquitectura del Interactive Lab y workflow del patrón 001. No se atribuye a los 365 patrones un flujo de ejecución inferido automáticamente.

Los datos de los usuarios siguen siendo locales, sin cuentas; la generación Archify ocurre en GitHub Actions, **no en el navegador del usuario**. La licencia Apache-2.0 y las atribuciones del proyecto se conservan en `web/public/archify/`. 

## Diagramas Archify por macrofamilia — segunda entrega

Se añaden diagramas de flujo revisados para los patrones 025 (RAG), 053 (Guardrails), 060 (Orchestrator–Workers) y 082 (MCP Server), además del Pipeline 001 y la arquitectura web. Los seis artefactos se generan con Archify 3.2.0 fijado, pasan por `finalize` y se sirven como HTML autónomo. La ficha de cada patrón conserva el visor SVG genérico como mapa alternativo de relaciones.

**Límites documentados:** P025 usa recuperación léxica sobre datos simulados; P053 tiene políticas pedagógicas, no autorización de acciones sensibles; P060 valida dependencias y despacha olas paralelas; P082 usa un transporte MCP en memoria. No se deben atribuir propiedades que las implementaciones no demuestran.

## Fase 2 — persistencia local (contratos)

`ArchitectureDiagram` v1 dispone de importación JSON con validación de esquema y límite de 1 MB, y adaptadores en memoria e IndexedDB. El almacenamiento es local, sin cuentas ni backend. La persistencia en el navegador puede ser eliminada por el usuario o por cuotas: la futura interfaz incluirá exportación manual. Los adaptadores todavía no están conectados a un editor visual público.

## Editor visual local — entrega MVP

La ruta `/lab/editor/` permite seleccionar patrones de las 42 macrofamilias, añadir nodos, arrastrarlos, conectarlos con relaciones tipadas, eliminar nodos con teclado, guardar y abrir proyectos en IndexedDB, e importar/exportar JSON validado. El lienzo SVG utiliza texto seguro y no ejecuta modelos, herramientas ni código del proyecto importado. El editor es un primer MVP sin XYFlow; el refinamiento de experiencia, undo/redo, pruebas E2E de navegador y simulación reproducible continúan pendientes. El navegador puede eliminar los proyectos: exporta JSON regularmente.

## Historial de edición

El editor ofrece controles Deshacer/Rehacer para operaciones sobre nodos y conexiones. El historial es local y acotado a 50 versiones; se reinicia al abrir, importar o crear un proyecto. No constituye auditoría ni sustituye la exportación JSON. El guardado en IndexedDB persiste el proyecto, no su historial.

## Edición de conexiones

La interfaz permite seleccionar una conexión existente por sus nodos y tipo, y eliminarla sin borrar los patrones asociados. La operación se incluye en el historial local de Deshacer/Rehacer y conserva la validación del grafo.

## Pruebas de navegador del editor

La suite `tests/interactive-lab-browser-e2e.test.mjs` se ejecuta contra el build Astro real servido por `astro preview`, en Chromium con Playwright. Verifica creación y conexión de patrones, borrado de aristas, deshacer/rehacer, guardado en IndexedDB tras recargar la página, exportación JSON, rechazo de etiquetas HTML importadas y movimiento mediante teclado y puntero. Se ejecuta en `.github/workflows/editor-e2e.yml` y no requiere credenciales ni un servidor de datos. La suite valida un navegador concreto; no sustituye pruebas de accesibilidad completas ni compatibilidad multiplataforma.

## Accesibilidad del editor — selección de nodos

El editor incorpora un selector de nodos y un botón explícito para eliminar el nodo elegido, además de movimiento con las teclas de dirección y borrado con Suprimir. El foco del teclado se indica visualmente y se ofrece ayuda contextual. Una prueba de Chromium comprueba que la eliminación mediante controles accesibles conserva el historial Deshacer. Esta mejora no constituye una auditoría WCAG completa.

## Gestión local de proyectos

El editor permite duplicar un proyecto con identificador nuevo, renombrarlo sin modificar los nodos, y muestra el estado de cambios sin guardar. Antes de crear otro proyecto, cargar uno existente o importar JSON se pide confirmación si se perderían cambios; también se avisa al abandonar la página. Los proyectos originales permanecen independientes de sus copias. Los datos se guardan solo en IndexedDB; exporta JSON como copia de seguridad.

## Fase 3 — simulación determinista (primera entrega)

La ruta `/lab/editor/` incluye «Simular arquitectura» y «Exportar traza». El motor puro valida el grafo y calcula oleadas topológicas estables, ordenando los nodos listos por identificador. Detecta ciclos y dependencias bloqueadas, y genera un informe JSON reproducible con `schemaVersion:1`, estado, oleadas, pasos, nodos bloqueados e incidencias. Las conexiones de cualquier tipo se interpretan como dependencias de precedencia para esta primera versión, **no como ejecución real de herramientas, modelos ni agentes**. Las trazas marcan `executedModels:false` y `executedTools:false`. Al editar la arquitectura se invalida la traza anterior. No se estiman tiempos, costes ni métricas empíricas.

## Fase 3 — diagnóstico estructural

El motor calcula profundidad máxima como **número de nodos** de la cadena de dependencias más larga en un DAG, con desempate determinista por identificadores. Muestra el tamaño de cada oleada y, ante bloqueos, distingue los nodos que pertenecen a ciclos (componentes fuertemente conexas) de los nodos bloqueados aguas abajo. Los resultados se incorporan a la exportación JSON como `structuralAnalysis`. Esta es una medida estructural, no una ruta crítica temporal: no se asignan duraciones, latencias ni costes a los nodos.

## Inspección visual por oleadas

Tras simular, el editor permite elegir una oleada mediante selector o controles Anterior/Siguiente. El lienzo SVG destaca los nodos activos en amarillo, la ruta estructural más larga en azul, los nodos cíclicos en rosa y los bloqueos derivados en violeta. La selección visual es efímera: al modificar el grafo se invalida la traza y se restauran los estilos originales. Los colores se acompañan de texto de estado y atributos accesibles; no implican ejecución real ni métricas temporales.

## Estadísticas y exportación de informe

El editor presenta recuentos estructurales de nodos, aristas, tamaño de oleadas y conexiones por tipo. «Exportar informe» genera JSON autocontenido con estadísticas, traza, diagnóstico y aviso metodológico. El informe es local y reproducible, sin latencias, costes, rendimiento ni ejecución de LLM/herramientas. Tras cualquier modificación se invalida el informe anterior.
