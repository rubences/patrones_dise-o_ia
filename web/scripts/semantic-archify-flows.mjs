// Reviewed against src/pattern_2_router.ts through src/pattern_5_tool_use.ts.
// These are source-specific flow maps, not assertions of real tool execution.
export const semanticFlows={
 2:{
  steps:[
   ['input','Consulta del cliente','mensaje','external'],
   ['classify','Clasificar con LLM','clasificar · DecisionSchema','backend'],
   ['gate','Umbral de confianza','confianza < confianzaMinima','backend'],
   ['human','Derivación humana','si confianza baja','external'],
   ['specialist','Especialista elegido','responderComoEspecialista','backend'],
   ['output','Respuesta de atención','Atencion','frontend']
  ],
  links:[['input','classify','mensaje'],['classify','gate','decisión validada'],['gate','human','baja confianza'],['gate','specialist','confianza suficiente'],['human','output','derivación'],['specialist','output','respuesta']],
  evidence:['DecisionSchema valida departamento, confianza y motivo','La confianza inferior al umbral devuelve una derivación humana','Se invoca un único especialista seleccionado']
 },
 3:{
  steps:[
   ['question','Pregunta','entrada','external'],
   ['draft','Respuesta inicial','generarRespuestaInicial','backend'],
   ['reflect','Reflexión crítica','reflexionarSobreRespuesta','backend'],
   ['revise','Respuesta mejorada','mejorarRespuesta','backend'],
   ['output','Resultado final','RespuestaConReflexion','frontend']
  ],
  links:[['question','draft','pregunta'],['draft','reflect','borrador'],['reflect','revise','comentarios'],['revise','output','respuesta final']],
  evidence:['La revisión es una segunda llamada al modelo','Las puntuaciones claridad 7, corrección 8 y completitud 6 están fijadas en el código, no se extraen del texto','No hay bucle de iteraciones: la mejora ocurre una sola vez']
 },
 4:{
  steps:[
   ['draft','Borrador y rúbrica','entrada','external'],
   ['critic','Crítica estructurada','criticar · CriticaSchema','backend'],
   ['gate','Comprobar aprobación','aprobado && nota >= notaMinima','backend'],
   ['rewrite','Reescribir problemas','reescribir','backend'],
   ['limit','Límite de rondas','maxRondas','backend'],
   ['output','Resultado de mejora','ResultadoMejora','frontend']
  ],
  links:[['draft','critic','evaluar'],['critic','gate','crítica'],['gate','output','aprobado'],['gate','rewrite','no aprobado'],['rewrite','limit','incrementar ronda'],['limit','critic','si quedan rondas'],['limit','output','límite alcanzado']],
  evidence:['La crítica usa CriticaSchema con nota, aprobado y problemas','La aprobación exige simultáneamente booleano aprobado y nota mínima','Tras una crítica no aprobada se reescribe, incluso en la última ronda; después se devuelve aprobado:false']
 },
 5:{
  steps:[
   ['question','Pregunta','entrada','external'],
   ['decision','Respuesta inicial LLM','responses.create','backend'],
   ['gate','¿Contiene «buscar»?','includes("buscar")','backend'],
   ['stub','Buscar web simulado','invocarHerramienta · respuesta fija','backend'],
   ['synthesis','Integrar resultado','segunda llamada LLM','backend'],
   ['output','Respuesta final','ResultadoToolUse','frontend']
  ],
  links:[['question','decision','pregunta'],['decision','gate','texto del modelo'],['gate','stub','sí'],['gate','output','no'],['stub','synthesis','resultado simulado'],['synthesis','output','respuesta integrada']],
  evidence:['No se declaran tools a la API: se inspecciona output_text buscando la palabra «buscar»','invocarHerramienta devuelve respuestas simuladas, no hace llamadas HTTP ni SQL','Solo se simula buscar_web; las otras herramientas figuran en HERRAMIENTAS pero no se despachan']
 }
 ,6:{
  steps:[['goal','Objetivo','entrada','external'],['plan','Generar plan','generarPlanInicial','backend'],['assess','Evaluar viabilidad','evaluarPlan','backend'],['refine','Refinar plan','refinarPlan','backend'],['result','Resultado','ResultadoPlanificacion','frontend']],
  links:[['goal','plan','objetivo'],['plan','assess','plan inicial'],['assess','refine','evaluación'],['refine','result','plan refinado']],
  evidence:['Las cuatro subtareas iniciales están codificadas como valores fijos','La viabilidad se infiere buscando «viable» en el texto, sin validación estructurada','El tiempo total suma las duraciones del plan inicial mediante parseInt, no calcula ruta crítica']
 },
 7:{
  steps:[['task','Tarea','entrada','external'],['roles','Roles especializados','ROLES_AGENTES','backend'],['parallel','Ejecución paralela','Promise.all · procesarConAgente','backend'],['synthesis','Síntesis orquestadora','sintetizarContribuciones','backend'],['consensus','Consenso aproximado','promedio de confianza','backend'],['result','Resultado multiagente','ResultadoMultiAgent','frontend']],
  links:[['task','roles','tarea'],['roles','parallel','4 roles'],['parallel','synthesis','contribuciones'],['synthesis','consensus','síntesis'],['consensus','result','resultado']],
  evidence:['Los cuatro roles se lanzan con Promise.all','La confianza de cada agente se genera con Math.random, no procede del modelo','El consenso se calcula con el promedio de confianzas aleatorias, no con comparación semántica']
 },
 8:{
  steps:[['task','Tarea','entrada','external'],['proposal','Propuesta de IA','generarProposal','backend'],['risk','Clasificar riesgo','búsqueda de palabras','backend'],['gate','¿Requiere aprobación?','requiereAprobacionHumana','backend'],['human','Decisión humana simulada','obtenerAprobacionHumana','backend'],['refine','Refinar propuesta','refinarProposal','backend'],['result','Resultado','ProcesoHITL','frontend']],
  links:[['task','proposal','tarea'],['proposal','risk','propuesta'],['risk','gate','riesgo'],['gate','human','medio/alto/crítico'],['gate','result','bajo'],['human','result','aprobado o rechazado'],['human','refine','solicita cambios'],['refine','result','propuesta refinada']],
  evidence:['La revisión humana está simulada mediante Math.random; no hay interacción humana real','La clasificación de riesgo utiliza coincidencias de texto','La aprobación y la ejecución se representan mediante cadenas de resultado, no acciones externas']
 },
 9:{
  steps:[['client','Cliente','ConfigAgente','external'],['factory','FabricaAgentes','crearAgente','backend'],['gate','Seleccionar tipo','switch(config.tipo)','backend'],['expert','Agente Experto','requiere especialización','backend'],['other','Otros agentes','generalista/supervisor/auditor','backend'],['result','Agente creado','interfaz Agente','frontend']],
  links:[['client','factory','configuración'],['factory','gate','tipo'],['gate','expert','experto'],['gate','other','otros tipos'],['expert','result','instancia'],['other','result','instancia']],
  evidence:['La fábrica selecciona una clase según config.tipo','El experto requiere especialización y lanza error si falta','Cada agente implementa procesarTarea; crearAgente no ejecuta el modelo']
 }
 ,10:{
  steps:[['client','Configuración de prompt','rol, contexto y tarea','external'],['builder','ConstructorPrompt','métodos fluidos','backend'],['parts','Añadir componentes','restricciones, ejemplos, formato','backend'],['construct','Construir texto','construir()','backend'],['model','Usar prompt','responses.create en demostración','backend'],['output','Respuesta','output_text','frontend']],
  links:[['client','builder','crear'],['builder','parts','componer'],['parts','construct','construir'],['construct','model','instrucciones'],['model','output','respuesta']],
  evidence:['ConstructorPrompt ensambla cadenas; no valida semánticamente las restricciones','reset() limpia el estado para reutilizar la instancia','Las llamadas al modelo aparecen en demostrarBuilder, no dentro de construir()']
 },
 11:{
  steps:[['model','Respuesta LLM','RespuestaLLM','external'],['registry','GestorAdaptadores','registrarAdaptador','backend'],['choose','Elegir formato','adaptar(respuesta, formato)','backend'],['json','Adaptador JSON','parseo o fallback','backend'],['other','Otros adaptadores','CSV, XML, Markdown, HTML','backend'],['output','RespuestaFormato','contenido adaptado','frontend']],
  links:[['model','registry','texto'],['registry','choose','formatos'],['choose','json','json'],['choose','other','otros'],['json','output','resultado'],['other','output','resultado']],
  evidence:['El JSON usa una expresión regular codiciosa y JSON.parse con fallback','El CSV transforma cada línea en una única celda entre comillas, no infiere columnas','Los adaptadores no garantizan que el contenido sea válido para todos los consumidores']
 },
 12:{
  steps:[['input','Entrada','solicitud','external'],['stack','Componer decoradores','wrappers encadenados','backend'],['validation','Validación','DecoradorValidacion','backend'],['cache','Caché','DecoradorCache','backend'],['retry','Reintentos','DecoradorRetry','backend'],['agent','Agente base','AgenteSimple','backend'],['output','Respuesta','procesar()','frontend']],
  links:[['input','stack','entrada'],['stack','validation','envolver'],['validation','cache','siguiente'],['cache','retry','miss'],['retry','agent','invocar'],['agent','output','respuesta'],['cache','output','hit']],
  evidence:['Los decoradores se componen mediante envolturas y pueden cambiar de orden','Retry usa espera lineal delayMs × intento, no backoff exponencial','La demostración utiliza varias composiciones, no una única cadena obligatoria']
 },
 13:{
  steps:[['question','Pregunta','entrada','external'],['context','GeneradorConEstrategia','estrategia activa','backend'],['select','Cambiar estrategia','cambiarEstrategia','backend'],['prompt','Construir prompt','generarPrompt','backend'],['model','Invocar LLM','configuracionLLM','backend'],['result','Resultado','respuesta y duración','frontend']],
  links:[['question','context','pregunta'],['context','select','estrategia'],['select','prompt','directa/reflexiva/creativa/etc.'],['prompt','model','instrucciones'],['model','result','respuesta']],
  evidence:['La estrategia modifica el prompt y la configuración de reasoning','La duración se mide durante la llamada y no es una predicción','La demostración compara como más rápida solo Directa frente a Reflexiva, aunque ejecuta otras estrategias']
 },
 14:{
  steps:[['request','Solicitud','prioridad y campo','external'],['first','Soporte nivel 1','puedoManejar','backend'],['technical','Soporte técnico','puedoManejar','backend'],['billing','Facturación','puedoManejar','backend'],['legal','Legal','puedoManejar','backend'],['supervisor','Supervisor','último manejador','backend'],['result','Respuesta o escalado','Respuesta','frontend']],
  links:[['request','first','iniciar'],['first','result','maneja'],['first','technical','no maneja'],['technical','result','maneja'],['technical','billing','no maneja'],['billing','result','maneja'],['billing','legal','no maneja'],['legal','result','maneja'],['legal','supervisor','no maneja'],['supervisor','result','resuelve o escala']],
  evidence:['Cada manejador decide con puedoManejar; si no puede, delega al siguiente','La cadena estándar ordena nivel 1, técnico, facturación, legal y supervisor','Si no existe un siguiente manejador se devuelve escalada:true y procesada:false']
 }
};
export function sourceSemanticDiagram(p,revision){
 const flow=semanticFlows[p.id];
 if(!flow)throw Error('No source-specific flow for '+p.id);
 const source={path:p.sourceFile,line:1,end_line:1};
 const nodes=flow.steps.map(([id,label,sublabel,type],col)=>({id,lane:'flow',col,type,label,sublabel,sources:[source]}));
 const edges=flow.links.map(([from,to,label],i)=>({id:'edge_'+(i+1),from,to,label}));
 return {
  schema_version:2,diagram_type:'workflow',
  meta:{title:`Patrón ${String(p.id).padStart(3,'0')} · ${p.name} · flujo contrastado con código`,locale:'es',quality_profile:'showcase',output:`dist/archify-build/pattern-${String(p.id).padStart(3,'0')}-${p.slug}.html`,repository:{url:'https://github.com/rubences/patrones_dise-o_ia',provider:'github',revision}},
  lanes:[{id:'flow',label:'Flujo de implementación'}],mainPath:flow.steps.map(s=>s[0]),nodes,edges,
  cards:[{dot:'cyan',title:'Flujo derivado del código',items:[`Fuente: ${p.sourceFile}`,...flow.evidence]},{dot:'amber',title:'Alcance',items:['Esquema revisado frente al archivo fuente; no es una traza de ejecución','Los pasos LLM no se ejecutan al visualizar este diagrama']}]
 };
}
