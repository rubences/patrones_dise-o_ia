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
