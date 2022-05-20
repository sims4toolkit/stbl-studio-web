import type { StringTableLocale } from "@s4tk/models/enums";
const StblLocaleImpl = window.S4TK.enums.StringTableLocale;

/**
 * Returns 2-digit code to use for the given locale.
 * 
 * @param locale Locale to get code for
 */
export function getLocaleCode(locale: StringTableLocale): string {
  switch (locale) {
    case StblLocaleImpl.English: return "EN";
    case StblLocaleImpl.ChineseSimplified: return "ZH";
    case StblLocaleImpl.ChineseTraditional: return "ZH";
    case StblLocaleImpl.Czech: return "CS";
    case StblLocaleImpl.Danish: return "DA";
    case StblLocaleImpl.Dutch: return "NL";
    case StblLocaleImpl.Finnish: return "FI";
    case StblLocaleImpl.French: return "FR";
    case StblLocaleImpl.German: return "DE";
    case StblLocaleImpl.Italian: return "IT";
    case StblLocaleImpl.Japanese: return "JA";
    case StblLocaleImpl.Korean: return "KO";
    case StblLocaleImpl.Norwegian: return "NO";
    case StblLocaleImpl.Polish: return "PL";
    case StblLocaleImpl.Portuguese: return "PT";
    case StblLocaleImpl.Russian: return "RU";
    case StblLocaleImpl.Spanish: return "ES";
    case StblLocaleImpl.Swedish: return "SV";
    default: return "??";
  }
}

/**
 * Returns name to use for locale.
 * 
 * @param locale Locale to get code for
 */
export function getLocaleName(locale: StringTableLocale): string {
  switch (locale) {
    case StblLocaleImpl.ChineseSimplified:
      return "Chinese (Simplified)";
    case StblLocaleImpl.ChineseTraditional:
      return "Chinese (Traditional)";
    default:
      return StblLocaleImpl[locale] ?? "Unknown";
  }
}
