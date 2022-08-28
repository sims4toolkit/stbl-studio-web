import type { StringTableLocale } from "@s4tk/models/enums";
import type { LocalizedStringEntry } from "src/lib/models/localized-stbl";

//#region Types

export enum SortOrder {
  Chronological,
  Alphanumeric,
  ReverseAlphanumeric,
}

export enum FilterType {
  Contains,
  ExactMatch,
  BeginsWith,
  EndsWith,
  Regex,
  KeyEquals,
}

export interface FilterTerm {
  type: FilterType;
  text: string;
}

//#endregion Types

//#region Options

function getOptionsForEnum(enumObj: object): { value: number; text: string; }[] {
  return Object
    .keys(enumObj)
    .filter(key => typeof key === "number")
    .map(value => {
      return {
        value,
        text: enumObj[value].replace(/[^^][A-Z]/g, " $1")
      };
    }) as unknown as { value: number; text: string; }[];
}

export const sortOrderOptions = getOptionsForEnum(SortOrder);
export const filterTypeOptions = getOptionsForEnum(FilterType);

//#endregion Options

//#region Functions

/**
 * Gets the entries to display using the provided sort order and filters.
 * 
 * @param locale Locale to use for value comparisons
 * @param entries Original entries in chronological order
 * @param sortOrder Order to sort entries in
 * @param filters Filters to apply
 */
export function getEntriesToShow(
  locale: StringTableLocale,
  entries: LocalizedStringEntry[],
  sortOrder: SortOrder,
  filters: FilterTerm[]
): LocalizedStringEntry[] {
  return getSortedEntries(
    locale,
    filterEntries(
      locale,
      entries,
      filters
    ),
    sortOrder
  );
}

function getSortedEntries(
  locale: StringTableLocale,
  entries: LocalizedStringEntry[],
  sortOrder: SortOrder,
): LocalizedStringEntry[] {
  switch (sortOrder) {
    case SortOrder.Alphanumeric:
      return [...entries].sort((a, b) => {
        const aValue = a.values.get(locale).toLowerCase();
        const bValue = b.values.get(locale).toLowerCase();
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      });
    case SortOrder.ReverseAlphanumeric:
      return getSortedEntries(
        locale,
        entries,
        SortOrder.Alphanumeric
      ).reverse();
    default:
      return entries;
  }
}

function filterEntries(
  locale: StringTableLocale,
  entries: LocalizedStringEntry[],
  filters: FilterTerm[]
): LocalizedStringEntry[] {
  let filteredEntries = entries;

  filters.forEach(filter => {
    filteredEntries = filteredEntries.filter(entry => {
      return testFilter(entry.key, entry.values.get(locale), filter);
    });
  });

  return filteredEntries;
}

function testFilter(
  key: number,
  value: string,
  filter: FilterTerm
): boolean {
  try {
    if (filter.type === FilterType.KeyEquals) {
      const keyToMatch = parseInt(filter.text, 16);
      return key === keyToMatch;
    } else if (filter.type === FilterType.Regex) {
      const regex = new RegExp(filter.text);
      return regex.test(value);
    } else {
      const entryString = value.toLowerCase();
      const userString = filter.text.toLowerCase();

      switch (filter.type) {
        case FilterType.Contains:
          return entryString.includes(userString);
        case FilterType.ExactMatch:
          return entryString === userString;
        case FilterType.BeginsWith:
          return entryString.startsWith(userString);
        case FilterType.EndsWith:
          return entryString.endsWith(userString);
        default:
          return true;
      }
    }
  } catch (e) {
    return false;
  }
}

//#endregion Functions
