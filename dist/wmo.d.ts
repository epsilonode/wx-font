export type CloudCategory='CLR'|'FEW'|'SCT'|'BKN'|'OVC';
export type WmoResolution={glyph:string;className:string;aviationClassName:string|null;cloudCategory:CloudCategory|null;ceilingRelevant:boolean;okta:number|null;descriptor:string|null};
export function normalizeCloudCover(percent:number|null):{maximumPercent:number|null;okta:number;descriptor:string;category:CloudCategory;friendlyModifier:string;aviationModifier:string;ceilingRelevant:boolean;dayGlyph:string;nightGlyph:string}|null;
export function resolveWmo(code:number,options?:{isDay?:boolean;cloudPercent?:number|null}):WmoResolution;
export const wmoContract:object;
