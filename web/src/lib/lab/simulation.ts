import type {ArchitectureDiagram} from './architecture-schema';
import {validateArchitecture} from './architecture-validation';

export type SimulationStatus='completed'|'blocked'|'invalid';
export interface SimulationStep {
 sequence:number;wave:number;nodeId:string;patternId:number;label:string;kind:'simulated';
}
export interface SimulationWave {index:number;nodeIds:string[]}
export interface SimulationReport {
 schemaVersion:1;projectId:string;status:SimulationStatus;
 waves:SimulationWave[];steps:SimulationStep[];blockedNodeIds:string[];issues:string[];
 executedModels:false;executedTools:false;
}
export function simulateArchitecture(input:unknown,knownPatternIds:ReadonlySet<number>):SimulationReport {
 const validation=validateArchitecture(input,knownPatternIds);
 const projectId=typeof input==='object'&&input!==null&&'id' in input&&typeof input.id==='string'?input.id:'invalid';
 const base:SimulationReport={schemaVersion:1,projectId,status:'invalid',waves:[],steps:[],blockedNodeIds:[],issues:[],executedModels:false,executedTools:false};
 if(!validation.ok)return {...base,issues:validation.errors};
 const graph:ArchitectureDiagram=validation.diagram;
 const byId=new Map(graph.nodes.map(n=>[n.id,n]));
 const degree=new Map(graph.nodes.map(n=>[n.id,0]));
 const adjacent=new Map(graph.nodes.map(n=>[n.id,new Set<string>()]));
 for(const e of graph.edges){
  const children=adjacent.get(e.source)!;
  if(!children.has(e.target)){children.add(e.target);degree.set(e.target,degree.get(e.target)!+1)}
 }
 const completed=new Set<string>();const waves:SimulationWave[]=[];const steps:SimulationStep[]=[];
 while(completed.size<graph.nodes.length){
  const ready=[...degree].filter(([id,d])=>d===0&&!completed.has(id)).map(([id])=>id).sort();
  if(ready.length===0){
   const blockedNodeIds=[...byId.keys()].filter(id=>!completed.has(id)).sort();
   return {...base,status:'blocked',waves,steps,blockedNodeIds,issues:['Dependencias sin resolver: posible ciclo en el grafo']};
  }
  const wave=waves.length+1;waves.push({index:wave,nodeIds:ready});
  for(const id of ready){
   const node=byId.get(id)!;
   steps.push({sequence:steps.length+1,wave,nodeId:id,patternId:node.patternId,label:node.label,kind:'simulated'});
  }
  for(const id of ready)completed.add(id);
  for(const id of ready)for(const target of adjacent.get(id)!)degree.set(target,degree.get(target)!-1);
 }
 return {...base,status:'completed',waves,steps};
}
