import type { StringTableResource } from "@s4tk/models";
import type { StringTableLocale } from "@s4tk/models/enums";
import type { StringTableJson } from "../../global";
const { models } = window.S4TK;

/**
 * The data for a LocalizedStringEntry.
 */
export interface LocalizedStringData {
  translated?: boolean;
  value: string;
}

/**
 * An entry in a LocalizedStringTable.
 */
export interface LocalizedStringEntry {
  readonly id: number;
  key: number;
  readonly values: Map<StringTableLocale, LocalizedStringData>;
}

/**
 * A string table that contains data for multiple languages.
 */
export default class LocalizedStringTable {
  //#region Properties

  private _allLocales: Set<StringTableLocale>;
  private _allLocalesCache?: StringTableLocale[];
  private _entryMap: Map<number, LocalizedStringEntry>;
  private _entriesCache?: LocalizedStringEntry[];
  private _nextId = 0;
  private _primaryLocale: StringTableLocale;

  //#endregion Properties

  //#region Getters / Setters

  get allLocales(): StringTableLocale[] {
    return this._allLocalesCache ??= [...this._allLocales];
  }

  get entries(): LocalizedStringEntry[] {
    return this._entriesCache ??= [...this._entryMap.values()];
  }

  get primaryLocale(): StringTableLocale { return this._primaryLocale; }
  set primaryLocale(locale: StringTableLocale) {
    if (this._primaryLocale !== locale) this._switchPrimaryLocale(locale);
  }

  //#endregion Getters / Setters

  //#region Initialization

  constructor() {
    // TODO:
  }

  //#endregion Initialization

  //#region Public Methods

  addEntry(key: number, string: string): LocalizedStringEntry {
    const id = this._nextId++;
    const values = new Map<StringTableLocale, LocalizedStringData>();
    values.set(this.primaryLocale, { value: string });
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
      value: this.getValue(entry.id, locale) ?? ""
    }));
  }

  getStringTable(locale = this.primaryLocale): StringTableResource {
    return new models.StringTableResource(this.getJson(locale));
  }

  getValue(id: number, locale = this.primaryLocale): string {
    return this._entryMap.get(id).values.get(locale).value ??
      (locale === this.primaryLocale
        ? ""
        : this.getValue(id)
      );
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

        existingEntry.values.set(locale, { value: entryToAdd.value });
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
        this.setString(entry.id, newEntries.get(entry.key));
        newEntries.delete(entry.key);
      } else {
        this.deleteEntry(entry.id);
      }
    });

    // add remaining strings
    newEntries.forEach((value, key) => this.addEntry(key, value));

    this._clearEntriesCache();
  }

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

  setString(id: number, value: string, locale = this.primaryLocale) {
    this.getEntry(id).values.get(locale).value = value;
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
        const value = entry.values.get(this.primaryLocale).value;
        entry.values.set(locale, { value });
        entry.values.delete(this.primaryLocale);
      }
    });

    this._primaryLocale = locale;
  }

  //#endregion Private Methods
}
