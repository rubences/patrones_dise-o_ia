export interface PatternRecord { patternId:number; slug:string; title:string; summary:string; related:number[]; combinesWith:number[] }
export interface GraphNode { id:string; patternId:number; slug:string; title:string; summary:string; primary:boolean }
export interface GraphEdge { id:string; source:string; target:string; kind:'related'|'combines-with' }
export interface PatternGraph { nodes:GraphNode[]; edges:GraphEdge[] }
export function buildPatternGraph(current:PatternRecord, all:PatternRecord[]):PatternGraph {
 const known=new Map(all.map(p=>[p.patternId,p]));known.set(current.patternId,current);
 const nodes:GraphNode[]=[{id:`p-${current.patternId}`,patternId:current.patternId,slug:current.slug,title:current.title,summary:current.summary,primary:true}];
 const edges:GraphEdge[]=[];const seenNodes=new Set([current.patternId]);const seenEdges=new Set<string>();
 for(const [kind,ids] of [['related',current.related],['combines-with',current.combinesWith]] as const){
  for(const id of ids){const p=known.get(id);if(!p||id===current.patternId)continue;
   if(!seenNodes.has(id)){nodes.push({id:`p-${id}`,patternId:id,slug:p.slug,title:p.title,summary:p.summary,primary:false});seenNodes.add(id)}
   const key=`${current.patternId}:${id}:${kind}`;if(seenEdges.has(key))continue;seenEdges.add(key);
   edges.push({id:key,source:`p-${current.patternId}`,target:`p-${id}`,kind});
  }
 }
 return {nodes,edges};
}
