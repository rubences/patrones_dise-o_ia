/** MCP policy gateway: reference policy decision only, not an MCP transport or enforcement sandbox. */
export class MCPPolicyGateway {
  constructor(private readonly permitted:(actor:string,tool:string,args:Record<string,unknown>)=>boolean){}
  authorize(actor:string,tool:string,args:Record<string,unknown>){
    if(typeof actor!=="string"||!actor.trim()||typeof tool!=="string"||!tool.trim()||!args||typeof args!=="object"||Array.isArray(args))throw Error("denied");
    const snapshot=structuredClone(args);
    if(!this.permitted(actor,tool,snapshot))throw Error("denied");
    return {actor,tool,allowed:true as const};
  }
}
export const PATTERN_124_META={id:124,name:"MCPPolicyGateway",family:"agent-interoperability",maturity:"emerging"} as const;
