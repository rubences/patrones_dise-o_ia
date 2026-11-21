import type {ArchitectureDiagram,ArchitectureNode,EdgeKind} from './architecture-schema';
const id=()=>globalThis.crypto?.randomUUID?.().replaceAll('-','').slice(0,24)??Math.random().toString(36).slice(2,16);
const ports=(kind:EdgeKind)=>[{id:'in_'+kind,direction:'input' as const,kind},{id:'out_'+kind,direction:'output' as const,kind}];
const allKinds:EdgeKind[]=['data','control','tool-call','delegation','evidence'];
const derived=(a:ArchitectureDiagram):ArchitectureDiagram=>({...a,patternIds:[...new Set(a.nodes.map(n=>n.patternId))].sort((x,y)=>x-y)});
export function newArchitecture(projectId:string,title:string):ArchitectureDiagram{return {schemaVersion:1,id:projectId,title,patternIds:[],nodes:[],edges:[]}}
export function addPatternNode(a:ArchitectureDiagram,patternId:number,label:string):ArchitectureDiagram {
 const n:ArchitectureNode={id:'n_'+id(),patternId,label,position:{x:80+(a.nodes.length%4)*220,y:70+Math.floor(a.nodes.length/4)*135},ports:allKinds.flatMap(ports)};
 return derived({...a,nodes:[...a.nodes,n]});
}
export function connectPatternNodes(a:ArchitectureDiagram,source:string,target:string,kind:EdgeKind):ArchitectureDiagram {
 if(source===target||!a.nodes.some(n=>n.id===source)||!a.nodes.some(n=>n.id===target))throw Error('Selecciona dos nodos distintos');
 if(a.edges.some(e=>e.source===source&&e.target===target&&e.kind===kind))throw Error('La conexión ya existe');
 return {...a,edges:[...a.edges,{id:'e_'+id(),source,sourcePort:'out_'+kind,target,targetPort:'in_'+kind,kind}]};
}
export function movePatternNode(a:ArchitectureDiagram,nodeId:string,x:number,y:number):ArchitectureDiagram {
 if(!Number.isFinite(x)||!Number.isFinite(y))throw Error('Posición inválida');
 return {...a,nodes:a.nodes.map(n=>n.id===nodeId?{...n,position:{x,y}}:n)};
}
export function removePatternNode(a:ArchitectureDiagram,nodeId:string):ArchitectureDiagram {
 return derived({...a,nodes:a.nodes.filter(n=>n.id!==nodeId),edges:a.edges.filter(e=>e.source!==nodeId&&e.target!==nodeId)});
}
