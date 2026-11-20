import type {ArchitectureDiagram,ArchitectureNode,ArchitecturePort,ArchitectureEdge,EdgeKind} from './architecture-schema';
export type ArchitectureValidation = {ok:true;diagram:ArchitectureDiagram}|{ok:false;errors:string[]};
const kinds=new Set<EdgeKind>(['data','control','tool-call','delegation','evidence']);
const record=(x:unknown):x is Record<string,unknown>=>typeof x==='object'&&x!==null&&!Array.isArray(x);
const safeText=(x:unknown,max:number)=>typeof x==='string'&&x.trim().length>0&&x.length<=max&&!/[<>\\u0000-\\u001f]/.test(x);
const id=(x:unknown)=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(x);
export function validateArchitecture(value:unknown,knownPatternIds:ReadonlySet<number>):ArchitectureValidation {
 const errors:string[]=[];const fail=(msg:string)=>errors.push(msg);
 if(!record(value))return {ok:false,errors:['Diagram must be an object']};
 if(value.schemaVersion!==1)fail('Unsupported schemaVersion');
 if(!id(value.id))fail('Invalid diagram id');
 if(!safeText(value.title,160))fail('Invalid title');
 const nodes:ArchitectureNode[]=[];const edges:ArchitectureEdge[]=[];
 if(!Array.isArray(value.nodes)||value.nodes.length>200)fail('Invalid node collection');
 else for(const [i,raw] of value.nodes.entries()){
  if(!record(raw)){fail('Invalid node '+i);continue;}
  if(!id(raw.id)||!Number.isInteger(raw.patternId)||!knownPatternIds.has(raw.patternId as number)||!safeText(raw.label,160)||!record(raw.position)||!Number.isFinite(raw.position.x)||!Number.isFinite(raw.position.y)||!Array.isArray(raw.ports)||raw.ports.length>20){fail('Invalid node '+i);continue;}
  const ports:ArchitecturePort[]=[];
  for(const p of raw.ports){if(!record(p)||!id(p.id)||!['input','output'].includes(p.direction as string)||!kinds.has(p.kind as EdgeKind)){fail('Invalid port '+i);continue;}ports.push({id:p.id as string,direction:p.direction as ArchitecturePort['direction'],kind:p.kind as EdgeKind});}
  if(new Set(ports.map(p=>p.id)).size!==ports.length)fail('Duplicate port '+i);
  nodes.push({id:raw.id as string,patternId:raw.patternId as number,label:raw.label as string,position:{x:raw.position.x as number,y:raw.position.y as number},ports});
 }
 if(new Set(nodes.map(n=>n.id)).size!==nodes.length)fail('Duplicate node IDs');
 const byNode=new Map(nodes.map(n=>[n.id,n]));
 if(!Array.isArray(value.edges)||value.edges.length>400)fail('Invalid edge collection');
 else for(const [i,raw] of value.edges.entries()){
  if(!record(raw)||!id(raw.id)||!id(raw.source)||!id(raw.target)||!id(raw.sourcePort)||!id(raw.targetPort)||!kinds.has(raw.kind as EdgeKind)){fail('Invalid edge '+i);continue;}
  const source=byNode.get(raw.source as string),target=byNode.get(raw.target as string);
  const out=source?.ports.find(p=>p.id===raw.sourcePort),input=target?.ports.find(p=>p.id===raw.targetPort);
  if(!source||!target||!out||!input||out.direction!=='output'||input.direction!=='input'||out.kind!==raw.kind||input.kind!==raw.kind){fail('Invalid edge connection '+i);continue;}
  edges.push({id:raw.id as string,source:raw.source as string,sourcePort:raw.sourcePort as string,target:raw.target as string,targetPort:raw.targetPort as string,kind:raw.kind as EdgeKind});
 }
 if(new Set(edges.map(e=>e.id)).size!==edges.length)fail('Duplicate edge IDs');
 const patternIds=[...new Set(nodes.map(n=>n.patternId))].sort((a,b)=>a-b);
 if(!Array.isArray(value.patternIds)||value.patternIds.length!==patternIds.length||value.patternIds.some((p,i)=>p!==patternIds[i]))fail('patternIds do not match nodes');
 return errors.length?{ok:false,errors}:{ok:true,diagram:{schemaVersion:1,id:value.id as string,title:value.title as string,patternIds,nodes,edges}};
}
