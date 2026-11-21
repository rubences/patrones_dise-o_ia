import {validateArchitecture} from './architecture-validation';
import {simulateArchitecture,type SimulationStatus} from './simulation';
export interface StructuralAnalysis {
 schemaVersion:1;projectId:string;status:SimulationStatus;
 nodeCount:number;edgeCount:number;waveSizes:number[];
 longestPathLength:number|null;longestPathNodeIds:string[];
 cyclicNodeIds:string[];downstreamBlockedNodeIds:string[];
 metricUnit:'nodes';issues:string[];
}
export function analyzeArchitecture(input:unknown,knownPatternIds:ReadonlySet<number>):StructuralAnalysis {
 const simulation=simulateArchitecture(input,knownPatternIds);
 const base:StructuralAnalysis={schemaVersion:1,projectId:simulation.projectId,status:simulation.status,nodeCount:0,edgeCount:0,waveSizes:simulation.waves.map(w=>w.nodeIds.length),longestPathLength:null,longestPathNodeIds:[],cyclicNodeIds:[],downstreamBlockedNodeIds:[],metricUnit:'nodes',issues:simulation.issues};
 const valid=validateArchitecture(input,knownPatternIds);
 if(!valid.ok)return base;
 const graph=valid.diagram;
 const ids=graph.nodes.map(n=>n.id).sort();
 const adjacency=new Map(ids.map(id=>[id,new Set<string>()]));
 for(const e of graph.edges)adjacency.get(e.source)!.add(e.target);
 const sorted=(id:string)=>[...adjacency.get(id)!].sort();
 let clock=0;const indices=new Map<string,number>(),low=new Map<string,number>(),stack:string[]=[],onStack=new Set<string>(),cyclic=new Set<string>();
 const visit=(id:string)=>{
  indices.set(id,clock);low.set(id,clock);clock++;stack.push(id);onStack.add(id);
  for(const next of sorted(id)){
   if(!indices.has(next)){visit(next);low.set(id,Math.min(low.get(id)!,low.get(next)!))}
   else if(onStack.has(next))low.set(id,Math.min(low.get(id)!,indices.get(next)!));
  }
  if(low.get(id)===indices.get(id)){
   const component:string[]=[];let next:string;
   do{next=stack.pop()!;onStack.delete(next);component.push(next)}while(next!==id);
   if(component.length>1||(component.length===1&&adjacency.get(component[0])!.has(component[0])))for(const n of component)cyclic.add(n);
  }
 };
 for(const id of ids)if(!indices.has(id))visit(id);
 const cyclicNodeIds=[...cyclic].sort();
 const downstreamBlockedNodeIds=simulation.blockedNodeIds.filter(id=>!cyclic.has(id)).sort();
 if(simulation.status!=='completed')return {...base,nodeCount:ids.length,edgeCount:graph.edges.length,cyclicNodeIds,downstreamBlockedNodeIds};
 const paths=new Map<string,string[]>();
 for(const wave of simulation.waves)for(const id of wave.nodeIds){
  const predecessors=graph.edges.filter(e=>e.target===id).map(e=>e.source).sort();
  let best:string[]=[];
  for(const p of predecessors){const candidate=paths.get(p)!;if(candidate.length>best.length||(candidate.length===best.length&&candidate.join('\0')<best.join('\0')))best=candidate}
  paths.set(id,[...best,id]);
 }
 let longest:string[]=[];
 for(const id of ids){const candidate=paths.get(id)!;if(candidate.length>longest.length||(candidate.length===longest.length&&candidate.join('\0')<longest.join('\0')))longest=candidate}
 return {...base,nodeCount:ids.length,edgeCount:graph.edges.length,longestPathLength:longest.length,longestPathNodeIds:longest};
}
