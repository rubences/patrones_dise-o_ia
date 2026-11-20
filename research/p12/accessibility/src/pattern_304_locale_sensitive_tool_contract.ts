/** P12 304: educational accessibility contract; not WCAG or equality certification. */
export class Pattern304Contract{validate(request:{locale:string;decimalSeparator:string;dateFormat:string},supported:ReadonlySet<string>){if(!/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(request.locale)||![".",","].includes(request.decimalSeparator)||!["ISO","DMY","MDY"].includes(request.dateFormat))throw Error("invalid locale contract");return {supported:supported.has(request.locale),locale:request.locale};}}
export const PATTERN_304_META={id:304,family:"ai-accessibility-inclusion",maturity:"experimental"} as const;
