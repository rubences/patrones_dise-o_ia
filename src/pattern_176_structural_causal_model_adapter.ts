/** P9 176 — illustrative acyclic structural causal model evaluator.
 * Interventions replace equations and exogenous assignments, but this does not identify causal effects.
 */
export type CausalEquation={
  variable:string;
  parents:string[];
  evaluate:(values:Readonly<Record<string,number>>)=>number;
};
export class Pattern176Contract {
  evaluate(
    equations:CausalEquation[],
    exogenous:Record<string,number>,
    interventions:Record<string,number>={}
  ){
    const validValues=(values:Record<string,number>)=>Object.values(values).every(Number.isFinite);
    if(!validValues(exogenous)||!validValues(interventions))throw Error("non-finite input");
    const variables=equations.map(e=>e.variable);
    if(new Set(variables).size!==variables.length||equations.some(e=>!e.variable||e.parents.some(p=>!p)))throw Error("invalid equations");
    const result:Record<string,number>={...exogenous,...interventions};
    const remaining=new Map(equations.map(e=>[e.variable,e]));
    while(remaining.size){
      let progress=false;
      for(const [name,e] of remaining){
        if(Object.hasOwn(interventions,name)){
          remaining.delete(name);progress=true;continue;
        }
        if(e.parents.every(p=>Object.hasOwn(result,p))){
          const value=e.evaluate(Object.freeze({...result}));
          if(!Number.isFinite(value))throw Error("invalid causal output");
          result[name]=value;remaining.delete(name);progress=true;
        }
      }
      if(!progress)throw Error("cycle or missing parent");
    }
    return result;
  }
}
export const PATTERN_176_META={id:176,name:"Structural Causal Model Adapter",family:"causal-neurosymbolic-ai",maturity:"experimental"} as const;
