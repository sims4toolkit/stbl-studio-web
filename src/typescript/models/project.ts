import type { StringTableResource as StblResourceType } from "@s4tk/models";
import type { StringTableLocale as StblLocaleType } from "@s4tk/models/enums";
import type { ProjectMetaData, StblMap } from "../../global";
import { v4 as uuidv4 } from "uuid";
import { loadStblMap, Settings, saveProjectMetaData, saveStblMap } from "../storage";
import ProjectView from "../enums/project-view";

const { StringTableResource } = window.S4TK.models;
const { StringTableLocale } = window.S4TK.enums;
const { fnv64 } = window.S4TK.hashing;

/**
 * A project that contains string tables and associated meta data.
 */
export default class Project implements ProjectMetaData {
  group: number;
  instanceBase: bigint;
  name: string;
  numLocales: number; // display only, use stblMap.size for logic
  numStrings: number; // display only, use primaryStbl.size for logic
  translatingTo: StblLocaleType;
  readonly uuid: string;
  view: ProjectView;

  private _stblMap: StblMap;
  get stblMap() {
    return this._stblMap ??= loadStblMap(this.uuid);
  }

  private _primaryLocale: StblLocaleType;
  get primaryLocale() { return this._primaryLocale; }
  set primaryLocale(newLocale: StblLocaleType) {
    if (this._primaryLocale !== newLocale) {
      const stbl = this.addLocale(newLocale);

      if (stbl.size !== this.primaryStbl.size) {
        this.primaryStbl.entries.forEach(entry => {
          if (!stbl.hasKey(entry.key))
            stbl.add(entry.key, entry.value);
        });
      }

      this._primaryLocale = newLocale;
    }
  }

  get allLocales(): StblLocaleType[] {
    return Array.from(this.stblMap.keys());
  }

  get primaryStbl(): StblResourceType {
    return this.stblMap.get(this.primaryLocale);
  }

  get allStbls(): StblResourceType[] {
    return Array.from(this.stblMap.values());
  }

  /**
   * Creates a new STBL from given data.
   * 
   * @param data Partial data to create project from
   * @param otherLocales Optional list of locales to ensure are in this STBL
   */
  constructor(
    data: Partial<ProjectMetaData>,
    stblMap?: StblMap,
    otherLocales?: StblLocaleType[]
  ) {
    this.uuid = data.uuid ?? uuidv4();
    this.name = data.name ?? this.uuid;
    this.group = data.group ?? 0;
    this.instanceBase = data.instanceBase ?? StringTableLocale.getInstanceBase(fnv64(this.uuid));
    this._primaryLocale = data.primaryLocale ?? Settings.defaultLocale;
    this.translatingTo = data.translatingTo ?? 0;
    this._stblMap = stblMap;
    this.view = data.view ?? ProjectView.List;

    if (stblMap) {
      this.addLocale(this.primaryLocale);
      otherLocales?.forEach(locale => {
        this.addLocale(locale);
      });
    }

    this.numLocales = data.numLocales
      ?? stblMap?.size
      ?? 1;

    this.numStrings = data.numStrings
      ?? stblMap?.get(this.primaryLocale).size
      ?? 0;
  }

  /**
   * Adds a STBL for the specified locale and returns it. If a STBL already
   * exists for the given locale, it is not changed.
   * 
   * @param locale Locale to add STBL for
   */
  addLocale(locale: StblLocaleType): StblResourceType {
    if (!this.stblMap.has(locale)) {
      const stbl = new StringTableResource();
      this.stblMap.set(locale, stbl);
      this.numLocales = this.stblMap.size;
      return stbl;
    } else {
      return this.stblMap.get(locale);
    }
  }

  /**
   * Replaces all of the locales, other than the primary one, in this project.
   * If this project has locales that are not included in the given list, they
   * will be removed. If it is missing any, they will be added. If it already
   * has some, they will be left alone.
   * 
   * @param locales New locales to use
   */
  setLocales(locales: StblLocaleType[]) {
    const localesToUse = new Set(locales);

    const localesToDelete: StblLocaleType[] = [];
    this.stblMap.forEach((_, locale) => {
      if (locale === this.primaryLocale) return;
      if (this.stblMap.has(locale) && !localesToUse.has(locale)) {
        localesToDelete.push(locale);
      }
    });

    localesToDelete.forEach(locale => {
      this.stblMap.delete(locale);
    });

    locales.forEach(locale => {
      this.addLocale(locale);
    });

    this.numLocales = this.stblMap.size;
  }

  /**
   * Adds a new entry and saves the project to storage.
   * 
   * @param key Key of entry to create
   * @param value Value of entry to create
   */
  addEntry(key: number, value: string) {
    this.primaryStbl.add(key, value);
    this.numStrings = this.primaryStbl.size;
    this.save();
  }

  /**
   * Deletes entries from all STBLs and saves the project to storage.
   * 
   * @param ids IDs of entries to delete
   */
  deleteEntries(ids: number[]) {
    ids.forEach(id => {
      this.stblMap.forEach(stbl => {
        stbl.delete(id);
      });
    });

    this.numStrings = this.primaryStbl.size;
    this.save();
  }

  /**
   * Replaces all entries in the primary STBL, and deletes/updates 
   * 
   * @param entries Entries to replace in primary STBL
   */
  replaceEntries(entries: { key: number; value: string }[]) {
    this.primaryStbl.replaceEntries(entries);

    this.stblMap.forEach(stbl => {
      const keysToDelete = new Set<number>();

      stbl.entries.forEach(entry => {
        if (!this.primaryStbl.hasKey(entry.key)) {
          keysToDelete.add(entry.key);
        }
      });

      keysToDelete.forEach(key => {
        stbl.deleteByKey(key);
      });
    });

    this.numStrings = this.primaryStbl.size;
    this.save();
  }

  /**
   * Updates the specifed keys in all STBLs.
   * 
   * @param updates Keys to update
   */
  updateKeys(updates: [number, number][]) {
    updates.forEach(([previous, current]) => {
      this.allStbls.forEach(stbl => {
        const entry = stbl.getByKey(previous);
        if (entry) entry.key = current;
      });
    });

    this.saveStblMap();
  }

  /**
   * Saves this project's meta data to localStorage.
   */
  async saveMetaData() {
    saveProjectMetaData(this);
  }

  /**
   * Saves this project's contents to localStorage.
   */
  async saveStblMap() {
    saveStblMap(this.uuid, this.stblMap);
  }

  /**
   * Saves this project's meta data and contents to localStorage.
   */
  async save() {
    this.saveMetaData();
    this.saveStblMap();
  }
}
