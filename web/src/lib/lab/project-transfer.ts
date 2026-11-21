import {validateArchitecture,type ArchitectureValidation} from './architecture-validation';
import type {ArchitectureDiagram} from './architecture-schema';
export const MAX_PROJECT_JSON_BYTES=1_000_000;
export function parseProjectJson(text:string,knownIds:ReadonlySet<number>):ArchitectureValidation {
 if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_PROJECT_JSON_BYTES)return {ok:false,errors:['Project JSON exceeds 1 MB']};
 try{return validateArchitecture(JSON.parse(text),knownIds)}catch{return {ok:false,errors:['Invalid JSON']}}
}
export function serializeProject(diagram:ArchitectureDiagram):string {
 return JSON.stringify(diagram,null,2);
}
