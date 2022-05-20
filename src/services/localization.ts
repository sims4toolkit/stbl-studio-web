import { StringTableLocale } from "@s4tk/models/enums";

/**
 * Returns 2-digit code to use for the given locale.
 * 
 * @param locale Locale to get code for
 */
export function getLocaleCode(locale: StringTableLocale): string {
  switch (locale) {
    case StringTableLocale.English: return "EN";
    case StringTableLocale.ChineseSimplified: return "ZH";
    case StringTableLocale.ChineseTraditional: return "ZH";
    case StringTableLocale.Czech: return "CS";
    case StringTableLocale.Danish: return "DA";
    case StringTableLocale.Dutch: return "NL";
    case StringTableLocale.Finnish: return "FI";
    case StringTableLocale.French: return "FR";
    case StringTableLocale.German: return "DE";
    case StringTableLocale.Italian: return "IT";
    case StringTableLocale.Japanese: return "JA";
    case StringTableLocale.Korean: return "KO";
    case StringTableLocale.Norwegian: return "NO";
    case StringTableLocale.Polish: return "PL";
    case StringTableLocale.Portuguese: return "PT";
    case StringTableLocale.Russian: return "RU";
    case StringTableLocale.Spanish: return "ES";
    case StringTableLocale.Swedish: return "SV";
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
    case StringTableLocale.ChineseSimplified:
      return "Chinese (Simplified)";
    case StringTableLocale.ChineseTraditional:
      return "Chinese (Traditional)";
    default:
      return StringTableLocale[locale] ?? "Unknown";
  }
}
