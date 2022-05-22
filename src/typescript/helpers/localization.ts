import localeData from "../../data/locales.json";
import type { StringTableLocale as StringTableLocaleType } from "@s4tk/models/enums";
import type { LocaleData } from "../../global";

const { StringTableLocale } = window.S4TK.enums;

localeData.forEach(data => {
  //@ts-expect-error Adding a value that isn't on the base
  data.enumValue = StringTableLocale[data.enumName];
});

export const allLocales = localeData as LocaleData[];

/**
 * Returns an object containing data for the given locale.
 * 
 * @param locale Locale to get data for
 */
export function getLocaleData(locale: StringTableLocaleType): LocaleData {
  return allLocales.find(data => data.enumValue === locale);
}

/**
 * Gets the name to display for a given locale.
 * 
 * @param localeData Locale to get display name for
 */
export function getDisplayName(localeData: LocaleData): string {
  if (!localeData.enumValue) return localeData.englishName;
  return `${localeData.englishName} (${localeData.nativeName})`;
}
