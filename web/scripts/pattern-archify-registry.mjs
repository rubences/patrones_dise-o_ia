import catalog from '../../catalog/patterns.json' with {type:'json'};
import {curatedDiagrams} from '../src/data/archify-diagrams.mjs';
import {semanticFlows,sourceSemanticDiagram} from './semantic-archify-flows.mjs';
export const patternDiagramOutput=(p)=>`pattern-${String(p.id).padStart(3,'0')}-${p.slug}.html`;
export function patternDiagramRegistry(){
 const curated=new Map(curatedDiagrams.filter(x=>x.patternId).map(x=>[x.patternId,x]));
 return catalog.patterns.map(p=>curated.get(p.id)??{id:`pattern-${String(p.id).padStart(3,'0')}`,type:'workflow',patternId:p.id,slug:p.slug,output:patternDiagramOutput(p),generated:true,reviewed:!!semanticFlows[p.id]});
}
export function patternSourceOverview(p,revision){
 if(semanticFlows[p.id])return sourceSemanticDiagram(p,revision);
 const output=patternDiagramOutput(p);
 const source={path:p.sourceFile,line:1,end_line:1};
 const names=[
  ['catalog','Catálogo','Metadatos canónicos','external'],
  ['source','Código fuente','Implementación de referencia','backend'],
  ['contract','Contrato','Inspección de interfaces','backend'],
  ['validation','Verificación','Revisar pruebas y evidencias','backend'],
  ['result','Ficha del patrón','Documentación y relaciones','frontend']
 ];
 const lanes=[{id:'reference',label:'Fuentes y documentación'}];
 const nodes=names.map(([id,label,sublabel,type],col)=>({id,lane:'reference',col,type,label,sublabel,sources:[source]}));
 return {schema_version:2,diagram_type:'workflow',meta:{title:`Patrón ${String(p.id).padStart(3,'0')} · ${p.name} · mapa de fuentes`,locale:'es',quality_profile:'showcase',output:`dist/archify-build/${output}`,repository:{url:'https://github.com/rubences/patrones_dise-o_ia',provider:'github',revision}},
 lanes,mainPath:nodes.map(n=>n.id),nodes,
 edges:nodes.slice(1).map((n,i)=>({id:`edge_${i+1}`,from:nodes[i].id,to:n.id,label:['referencia','contrato','revisión','documentación'][i]})),
 cards:[{dot:'cyan',title:'Referencia canónica',items:[`Patrón #${p.id} · ${p.name}`,`Familia: ${p.family}`,`Código: ${p.sourceFile}`]},{dot:'amber',title:'Alcance del diagrama',items:['Mapa esquemático generado automáticamente desde el catálogo','No representa un flujo de ejecución auditado ni sustituye los diagramas curados','No ejecuta modelos, herramientas ni servicios']}]
 };
}
