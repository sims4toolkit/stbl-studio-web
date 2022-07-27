import type { StringEntry } from "@s4tk/models/types";
import type { StringFilterTerm } from "../../global";

enum FilterType {
  Contains,
  ExactMatch,
  BeginsWith,
  EndsWith,
  Regex,
  KeyEquals,
}

/**
 * Returns true if the entry passes the filter, false if it doesn't.
 * 
 * @param entry String entry to test the filter on
 * @param filter The filter to test with
 */
export function testFilter(entry: StringEntry, filter: StringFilterTerm): boolean {
  try {
    if (filter.type === FilterType.KeyEquals) {
      const keyToMatch = parseInt(filter.text, 16);
      return entry.keyEquals(keyToMatch);
    } else if (filter.type === FilterType.Regex) {
      const regex = new RegExp(filter.text);
      return regex.test(entry.string);
    } else {
      const entryString = entry.string.toLowerCase();
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

export default FilterType;
