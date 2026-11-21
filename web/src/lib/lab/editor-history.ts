import type {ArchitectureDiagram} from './architecture-schema';
export interface EditorHistory {past:ArchitectureDiagram[];present:ArchitectureDiagram;future:ArchitectureDiagram[]}
const copy=(a:ArchitectureDiagram)=>structuredClone(a);
export function createHistory(present:ArchitectureDiagram):EditorHistory{return {past:[],present:copy(present),future:[]}}
export function commitHistory(h:EditorHistory,next:ArchitectureDiagram):EditorHistory{
 if(JSON.stringify(h.present)===JSON.stringify(next))return h;
 return {past:[...h.past,copy(h.present)].slice(-50),present:copy(next),future:[]};
}
export function undoHistory(h:EditorHistory):EditorHistory{
 if(!h.past.length)return h;
 return {past:h.past.slice(0,-1),present:copy(h.past.at(-1)!),future:[copy(h.present),...h.future]};
}
export function redoHistory(h:EditorHistory):EditorHistory{
 if(!h.future.length)return h;
 return {past:[...h.past,copy(h.present)].slice(-50),present:copy(h.future[0]),future:h.future.slice(1)};
}
