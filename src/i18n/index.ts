import type { Locale } from "./config";
import { en, type Dict } from "./en";
import { fa } from "./fa";

export type { Locale } from "./config";
export { isRtl, localePath, basePath, num, pad2, locales, SITE } from "./config";
export type { Dict };

const dicts: Record<Locale, Dict> = { en, fa };
export const getDict = (l: Locale): Dict => dicts[l];
