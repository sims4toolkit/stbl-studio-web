import type { StringEntry } from "@s4tk/models/types";

enum SortOrder {
  Chronological,
  Alphanumeric,
  ReverseAlphanumeric
}

/**
 * Returns a sorted copy of the given list. Does not mutate the original.
 * 
 * @param entries List of entries to sort
 * @param order Order in which to sort entries
 */
export function sortEntries(
  entries: StringEntry[],
  order: SortOrder
): StringEntry[] {
  switch (order) {
    case SortOrder.Alphanumeric:
      return [...entries].sort((a, b) => {
        const aString = a.string.toLowerCase();
        const bString = b.string.toLowerCase();
        if (aString < bString) return -1;
        if (aString > bString) return 1;
        return 0;
      });
    case SortOrder.ReverseAlphanumeric:
      return sortEntries(entries, SortOrder.Alphanumeric).reverse();
    default:
      return entries;
  }
}

export default SortOrder;
