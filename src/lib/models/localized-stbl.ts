import type { StringTableResource } from "@s4tk/models";
import type { StringTableLocale } from "@s4tk/models/enums";
import DatabaseService from "src/lib/services/database";
const { models, encoding, formatting } = window.S4TK;
const { Buffer } = window.S4TK.Node;

const UNTRANSLATED_PLACEHOLDER = "";

/**
 * An entry in a LocalizedStringTable.
 */
export interface LocalizedStringEntry {
  readonly id: number;
  key: number;
  values: Map<StringTableLocale, string>;
}

/**
 * An issue that may occur in a STBL.
 */
export interface LocalizedStringTableIssue {
  idList: number[];
  keyList: number[];
  message: string;
}

/**
 * A string table that contains data for multiple languages.
 */
export default class LocalizedStringTable {
  static readonly VERSION = 0;

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

  /** Map of keys to IDs of the first entries that use it. */
  get keyMap(): Map<number, number> {
    const keyMap = new Map<number, number>();
    this.entries.forEach(({ id, key }) => {
      if (!keyMap.has(key)) keyMap.set(key, id);
    });
    return keyMap;
  }

  get otherLocales(): StringTableLocale[] {
    const otherLocales = new Set(this._allLocales);
    otherLocales.delete(this.primaryLocale);
    return [...otherLocales];
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

  /**
   * Parses a Base64-encoded string as a LocalizedStringTable.
   * 
   * @param string String to deserialize
   */
  static deserialize(string: string): LocalizedStringTable {
    const buffer = Buffer.from(string, "base64");
    const decoder = new encoding.BinaryDecoder(buffer);

    decoder.skip(1); // version currently unneeded
    const primaryLocale = decoder.uint8();
    const numLocales = decoder.uint8();
    const numEntries = decoder.uint32();

    const allLocales = new Set<StringTableLocale>();
    const localesToDecode: StringTableLocale[] = [];
    for (let i = 0; i < numLocales; ++i) {
      const locale = decoder.uint8();
      const hasData = decoder.boolean();
      allLocales.add(locale);
      if (hasData) localesToDecode.push(locale);
    }

    const entries: Partial<LocalizedStringEntry>[] = [];
    for (let i = 0; i < numEntries; ++i) {
      entries.push({
        key: decoder.uint32(),
        values: new Map()
      });
    }

    localesToDecode.forEach(locale => {
      for (let i = 0; i < numEntries; ++i) {
        const value = decoder.string();
        if (value) entries[i].values.set(locale, value);
      }
    });

    return new LocalizedStringTable(
      primaryLocale,
      allLocales,
      (entries as LocalizedStringEntry[])
    );
  }

  //#endregion Initialization

  //#region Public Methods

  /**
   * Creates and returns a new entry in this STBL from the given key/value pair.
   * 
   * @param key Key of entry to add
   * @param string String value of entry to add
   */
  addEntry(key: number, string: string): LocalizedStringEntry {
    const id = this._nextId++;
    const values = new Map<StringTableLocale, string>();
    values.set(this.primaryLocale, string);
    const entry = { id, key, values };
    this._entryMap.set(id, entry);
    this._clearEntriesCache();
    return entry;
  }

  /**
   * Deletes the entry with the given ID.
   * 
   * @param id ID of entry to delete
   */
  deleteEntry(id: number) {
    this._entryMap.delete(id);
    this._clearEntriesCache();
  }

  /**
   * Returns true if the given locale is in this project.
   * 
   * @param locale Locale to check for
   */
  hasLocale(locale: StringTableLocale): boolean {
    return this._allLocales.has(locale);
  }

  /**
   * Returns the entry with the given ID.
   * 
   * @param id ID of entry to get
   */
  getEntry(id: number): LocalizedStringEntry {
    return this._entryMap.get(id);
  }

  /**
   * Returns a list of issues found in this stbl.
   */
  getIssues(): LocalizedStringTableIssue[] {
    const issues: LocalizedStringTableIssue[] = [];

    // maps keys to list of IDs
    const foundKeys = new Map<number, number[]>();

    // maps strings to list of IDs
    const foundStrings = new Map<string, number[]>();

    // populating above maps
    this._entryMap.forEach((entry, id) => {
      if (foundKeys.has(entry.key)) {
        foundKeys.get(entry.key).push(id);
      } else {
        foundKeys.set(entry.key, [id]);
      }

      const value = this.getValue(id) ?? "";
      if (foundStrings.has(value)) {
        foundStrings.get(value).push(id);
      } else {
        foundStrings.set(value, [id]);
      }
    });

    const getKeys: (idList: number[]) => number[] = idList => {
      const keys = idList.map(id => this.getEntry(id).key);
      return [...new Set(keys)];
    };

    foundKeys.forEach((idList, key) => {
      if (key === 0) {
        issues.push({
          idList,
          keyList: getKeys(idList),
          message: 'Key is 0x00000000'
        });
      } else if (key === 0x811C9DC5) {
        issues.push({
          idList,
          keyList: getKeys(idList),
          message: 'Key is 0x811C9DC5 (the hash of an empty string)'
        })
      }

      if (idList.length > 1) {
        issues.push({
          idList,
          keyList: getKeys(idList),
          message: `Repeated key: ${formatting.formatStringKey(key)}`
        });
      }
    });

    foundStrings.forEach((idList, string) => {
      if (!string) {
        issues.push({
          idList,
          keyList: getKeys(idList),
          message: "Empty string value"
        });
      }

      if (idList.length > 1) {
        const trimmedString = string.length > 20
          ? string.substring(0, 20) + "..."
          : string;

        issues.push({
          idList,
          keyList: getKeys(idList),
          message: `Repeated string: "${trimmedString}"`
        });
      }
    });

    return issues;
  }

  /**
   * Returns a JSON structure containing the key/value pairs for the given
   * locale.
   * 
   * @param locale Locale to create JSON for (primary locale by default)
   * @param hex Whether or not the key should be formatted as a hex string
   */
  getJson<T extends number | string = number | string>(
    locale = this.primaryLocale,
    hex = false
  ): StringTableJson<T> {
    return this.entries.map(entry => ({
      key: hex ? formatting.formatStringKey(entry.key) : entry.key,
      value: this.getValueWithFallback(entry.id, locale)
    })) as StringTableJson<T>;
  }

  /**
   * Returns a STBL containing the key/value pairs for the given locale.
   * 
   * @param locale Locale to create STBL for (primary locale by default)
   */
  getStringTable(locale = this.primaryLocale): StringTableResource {
    return new models.StringTableResource(this.getJson<number>(locale));
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
    return this._entryMap.get(id)?.values.get(locale);
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

  /**
   * Returns true if an entry with the given ID exists, false otherwise.
   * 
   * @param id ID of entry to check for
   */
  hasEntry(id: number) {
    return this._entryMap.has(id);
  }

  /**
   * Adds all entries in the given stbl to this one. If `overwriteKeys` is true,
   * then any strings being imported that have a key already in use by this
   * project will overwrite the exisitng ones. If `overwriteKeys` is false, then
   * the entries will just be added to this stbl's list of entries as-is.
   * 
   * @param stbl Stbl containing entries to import
   * @param overwriteKeys Whether or not to replace entries with repeated keys
   */
  importEntries(stbl: LocalizedStringTable, overwriteKeys: boolean) {
    stbl.allLocales.forEach(locale => {
      if (!this.hasLocale(locale)) this._allLocales.add(locale);
    });

    this._clearLocalesCache();

    if (overwriteKeys) {
      const theseKeys = this.keyMap;

      stbl.entries.forEach(({ key, values }) => {
        if (theseKeys.has(key)) {
          const existingEntry = this.getEntry(theseKeys.get(key));
          values.forEach((string, locale) => {
            existingEntry.values.set(locale, string);
          });
        } else {
          const id = this._nextId++;
          this._entryMap.set(id, { id, key, values: new Map(values) });
        }
      });
    } else {
      stbl.entries.forEach(({ key, values }) => {
        const id = this._nextId++;
        this._entryMap.set(id, { id, key, values: new Map(values) });
      });
    }

    this._clearEntriesCache();
  }

  /**
   * Replaces all entries in this STBL. If any entries have keys that already
   * exist, the text for those entries will be updated. If any entries have
   * new keys, new entries will be created. If there are any keys in this STBL
   * that do not appear in the given entries, they will be deleted.
   * 
   * @param entries Entries to use
   */
  replaceEntries(entries: StringTableJson<number>) {
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
    const newLocaleSet = new Set(locales);
    newLocaleSet.add(this.primaryLocale); // just to make sure

    // delete existing locales that are not in new set
    this.allLocales.forEach(locale => {
      if (newLocaleSet.has(locale)) {
        newLocaleSet.delete(locale);
      } else {
        this._allLocales.delete(locale);
        this.entries.forEach(entry => {
          entry.values.delete(locale);
        });
      }
    });

    // add missing locales
    newLocaleSet.forEach(locale => {
      this._allLocales.add(locale);
    });

    this._clearLocalesCache();
  }

  /**
   * Writes this string table to storage.
   */
  async saveToStorage(uuid: string) {
    DatabaseService.setItem("stbls", uuid, this.serialize());
  }

  /**
   * Updates the key for the entry with the given ID.
   * 
   * @param id ID of entry to change key of
   * @param key New key to use for entry
   */
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

  /**
   * Writes this LocalizedStringTable into a Base64-encoded string.
   */
  serialize(): string {
    const localesWithData: StringTableLocale[] = [];

    const headerBuffer = (() => {
      const bufferSize = 7 + (this.numLocales * 2) + (this.numEntries * 4);
      const buffer = Buffer.alloc(bufferSize);
      const encoder = new encoding.BinaryEncoder(buffer);

      // header & properties (7 bytes)
      encoder.uint8(LocalizedStringTable.VERSION);
      encoder.uint8(this.primaryLocale);
      encoder.uint8(this.numLocales);
      encoder.uint32(this.numEntries);

      // locale data
      this.allLocales.forEach(locale => {
        encoder.uint8(locale);
        const hasData = this.entries.some(entry => entry.values.has(locale));
        if (hasData) localesWithData.push(locale);
        encoder.boolean(hasData);
      });

      // keys
      this.entries.forEach(entry => encoder.uint32(entry.key));

      return buffer;
    })();

    const entriesBuffer = Buffer.concat(localesWithData.map(locale => {
      return Buffer.concat(this.entries.map(entry => {
        const value = entry.values.get(locale) ?? "";
        const buffer = Buffer.alloc(Buffer.byteLength(value) + 1);
        const encoder = new encoding.BinaryEncoder(buffer);
        encoder.charsUtf8(value);
        return buffer;
      }));
    }));

    return Buffer.concat([
      headerBuffer,
      entriesBuffer
    ]).toString("base64");
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
        entry.values.set(locale, UNTRANSLATED_PLACEHOLDER);
      }
    });

    this._primaryLocale = locale;
  }

  //#endregion Private Methods
}
