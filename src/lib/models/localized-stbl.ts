import type { StringTableResource } from "@s4tk/models";
import type { StringTableLocale } from "@s4tk/models/enums";
const { models } = window.S4TK;

type StringTableJson = {
  key: number;
  value: string;
}[];

/**
 * An entry in a LocalizedStringTable.
 */
export interface LocalizedStringEntry {
  readonly id: number;
  key: number;
  readonly values: Map<StringTableLocale, string>;
}

/**
 * A string table that contains data for multiple languages.
 */
export default class LocalizedStringTable {
  //#region Properties

  private _allLocalesCache?: StringTableLocale[];
  private _entryMap: Map<number, LocalizedStringEntry>;
  private _entriesCache?: LocalizedStringEntry[];
  private _nextId = 0;

  //#endregion Properties

  //#region Getters / Setters

  get allLocales(): StringTableLocale[] {
    return this._allLocalesCache ??= [...this._allLocales];
  }

  get entries(): LocalizedStringEntry[] {
    return this._entriesCache ??= [...this._entryMap.values()];
  }

  get numEntries(): number {
    return this._entryMap.size;
  }

  get numLocales(): number {
    return this._allLocales.size;
  }

  get primaryLocale(): StringTableLocale { return this._primaryLocale; }
  set primaryLocale(locale: StringTableLocale) {
    if (this._primaryLocale !== locale) this._switchPrimaryLocale(locale);
  }

  //#endregion Getters / Setters

  //#region Initialization

  constructor(
    private _primaryLocale: StringTableLocale,
    private _allLocales: Set<StringTableLocale> = new Set(),
    entries: Omit<LocalizedStringEntry, "id">[] = []
  ) {
    if (!_allLocales.has(_primaryLocale))
      _allLocales.add(_primaryLocale);

    this._entryMap = new Map();
    entries.forEach(({ key, values }) => {
      const id = this._nextId++;
      this._entryMap.set(id, { id, key, values });
    });
  }

  //#endregion Initialization

  //#region Public Methods

  addEntry(key: number, string: string): LocalizedStringEntry {
    const id = this._nextId++;
    const values = new Map<StringTableLocale, string>();
    values.set(this.primaryLocale, string);
    const entry = { id, key, values };
    this._entryMap.set(id, entry);
    this._clearEntriesCache();
    return entry;
  }

  deleteEntry(id: number) {
    this._entryMap.delete(id);
    this._clearEntriesCache();
  }

  getEntry(id: number): LocalizedStringEntry {
    return this._entryMap.get(id);
  }

  getJson(locale = this.primaryLocale): StringTableJson {
    return this.entries.map(entry => ({
      key: entry.key,
      value: this.getValueWithFallback(entry.id, locale)
    }));
  }

  getStringTable(locale = this.primaryLocale): StringTableResource {
    return new models.StringTableResource(this.getJson(locale));
  }

  /**
   * Returns the value of the entry with the given ID in the given locale. If
   * there is no value for the given locale (including if the locale is not in
   * this STBLs locale set), undefined is returned.
   * 
   * @param id ID of entry to get value for
   * @param locale Locale to get value for (primary locale by default)
   */
  getValue(id: number, locale = this.primaryLocale): string {
    return this._entryMap.get(id).values.get(locale);
  }

  /**
   * Returns the value of the entry with the given ID in the given locale, if it
   * exists. If not, then it returns the value for the primary locale. When 
   * building string tables and JSONs, this function should be used instead of
   * `getValue()`.
   * 
   * @param id ID of entry to get value for
   * @param locale Locale to get value for
   */
  getValueWithFallback(id: number, locale: StringTableLocale): string {
    return this.getValue(id, locale)
      ?? this.getValue(id, this.primaryLocale)
      ?? "";
  }

  hasEntry(id: number) {
    return this._entryMap.has(id);
  }

  importEntries(entries: StringTableJson, locale = this.primaryLocale) {
    if (locale === this.primaryLocale) {
      entries.forEach(entry => this.addEntry(entry.key, entry.value));
    } else {
      entries.forEach(entryToAdd => {
        const existingEntry = this.entries.find(existingEntry => {
          return existingEntry.key === entryToAdd.key;
        }) ?? this.addEntry(entryToAdd.key, entryToAdd.value);

        existingEntry.values.set(locale, entryToAdd.value);
      });
    }

    this._clearEntriesCache();
  }

  replaceEntries(entries: StringTableJson) {
    const newEntries = new Map<number, string>();
    entries.forEach(({ key, value }) => newEntries.set(key, value));

    // updating existing strings & delete missing ones
    this.entries.forEach(entry => {
      if (newEntries.has(entry.key)) {
        this.setValue(entry.id, newEntries.get(entry.key));
        newEntries.delete(entry.key);
      } else {
        this.deleteEntry(entry.id);
      }
    });

    // add remaining strings
    newEntries.forEach((value, key) => this.addEntry(key, value));

    this._clearEntriesCache();
  }

  /**
   * Replaces the locales in this string table. If locales are removed, then
   * all translations for those locales will be deleted.
   * 
   * @param locales New locales to use
   */
  replaceLocales(locales: StringTableLocale[]) {
    if (!locales.includes(this.primaryLocale))
      throw new Error("Locale list must include primary locale.");

    const newLocaleSet = new Set(locales);

    // delete existing locales that are not in new set
    this.allLocales.forEach(locale => {
      if (newLocaleSet.has(locale)) {
        newLocaleSet.delete(locale);
      } else {
        this._allLocales.delete(locale);
      }
    });

    // add missing locales
    newLocaleSet.forEach(locale => {
      this._allLocales.add(locale);
    });

    this._clearLocalesCache();
  }

  setKey(id: number, key: number) {
    this.getEntry(id).key = key;
  }

  /**
   * Sets the value of the given entry for the given locale.
   * 
   * @param id ID of entry to set value of
   * @param value String value to set
   * @param locale Locale to set value for (primary locale by default)
   */
  setValue(id: number, value: string, locale = this.primaryLocale) {
    if (!this._allLocales.has(locale))
      throw new Error("Cannot set value of locale that isn't in this STBL.");

    const values = this.getEntry(id).values;

    if (locale === this.primaryLocale) {
      values.set(locale, value);
    } else if (this.getValue(id) === value) {
      values.delete(locale);
    } else {
      values.set(locale, value);
    }
  }

  //#endregion Public Methods

  //#region Private Methods

  private _clearEntriesCache() {
    delete this._entriesCache;
  }

  private _clearLocalesCache() {
    delete this._allLocalesCache;
  }

  private _switchPrimaryLocale(locale: StringTableLocale) {
    if (!this._allLocales.has(locale)) {
      this._allLocales.add(locale);
      this._clearLocalesCache();
    }

    // fill in all missing strings
    this.entries.forEach(entry => {
      if (!entry.values.has(locale)) {
        const value = entry.values.get(this.primaryLocale);
        entry.values.set(locale, value);
        entry.values.delete(this.primaryLocale);
      }
    });

    this._primaryLocale = locale;
  }

  //#endregion Private Methods
}
