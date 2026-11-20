/** Pattern 132: untrusted tool metadata screening; NOT a complete prompt-injection defense.
 * All remote descriptions and tool outputs must remain untrusted data. Policy enforcement is independent.
 */
export class ToolPoisoningDefense {
  private readonly indicators=[
    /ignore\s+(?:all\s+)?(?:previous|system)\s+instructions/i,
    /(?:reveal|print|expose)\s+(?:the\s+)?(?:system\s+prompt|secrets?)/i,
    /(?:send|exfiltrate|upload)\b.{0,100}\b(?:api\s*key|password|token|credential)/i,
    /(?:ignora|omite)\s+(?:todas?\s+)?(?:las\s+)?instrucciones/i,
    /(?:muestra|revela)\s+(?:el\s+)?(?:prompt\s+del\s+sistema|contraseñas?)/i
  ];
  inspect(description:string){
    if(typeof description!=="string"||description.length>16384)throw Error("invalid tool metadata");
    if(this.indicators.some(pattern=>pattern.test(description)))throw Error("suspicious tool metadata");
    return {safe:true,trustLevel:"untrusted" as const,requiresPolicyEnforcement:true};
  }
}
export const PATTERN_132_META={id:132,name:"ToolPoisoningDefense",family:"agent-interoperability",maturity:"emerging"} as const;
