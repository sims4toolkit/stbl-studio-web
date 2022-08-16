import type { StringTableLocale } from "@s4tk/models/enums";
import localeData from "../../data/locales.json";
const { enums } = window.S4TK;

interface LocaleData {
  enumName: string;
  enumValue: string;
  englishName: string;
  country: string;
  nativeName: string;
  code: string;
}

const localeDataMap = new Map<StringTableLocale, LocaleData>();

localeData.forEach(data => {
  const enumValue = enums.StringTableLocale[data.enumName];
  //@ts-expect-error Adding a value that isn't on the base
  data.enumValue = enumValue
  localeDataMap.set(enumValue, data as LocaleData);
});

/**
 * Returns an object containing data for the given locale.
 * 
 * @param locale Locale to get data for
 */
export function getLocaleData(locale: StringTableLocale): LocaleData {
  return localeDataMap.get(locale);
}

/**
 * Gets the name to display for a given locale.
 * 
 * @param locale Locale to get display name for
 */
export function getDisplayName(locale: StringTableLocale): string {
  const localeData = getLocaleData(locale);
  if (!localeData.enumValue) return localeData.englishName;
  return `${localeData.englishName} (${localeData.nativeName})`;
}
