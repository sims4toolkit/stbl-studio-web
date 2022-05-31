import type { StringTableResource as StblResourceType } from "@s4tk/models";
import type { StringTableLocale as StblLocaleType } from "@s4tk/models/enums";
import type { ProjectMetaData, StblMap } from "../../global";
import { v4 as uuidv4 } from "uuid";
import { getInstanceBase } from "../helpers/tgi";
import { loadStblMap, Settings, saveProjectMetaData, saveStblMap } from "../storage";
import ProjectView from "../enums/project-view";

const { StringTableResource } = window.S4TK.models;
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
  primaryLocale: StblLocaleType;
  readonly uuid: string;
  view: ProjectView;

  private _stblMap: StblMap;
  get stblMap() {
    return this._stblMap ??= loadStblMap(this.uuid);
  }

  get allLocales(): StblLocaleType[] {
    return Array.from(this.stblMap.keys());
  }

  get primaryStbl(): StblResourceType {
    return this.stblMap.get(this.primaryLocale);
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
    this.instanceBase = data.instanceBase ?? getInstanceBase(fnv64(this.uuid));
    this.primaryLocale = data.primaryLocale ?? Settings.defaultLocale;
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
   * exists for the given locale, it is not changed and it is returned.
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
   * Removes the STBL for the specified locale.
   * 
   * @param locale Locale to remove STBL for
   */
  removeLocale(locale: StblLocaleType) {
    this.stblMap.delete(locale);
    this.numLocales = this.stblMap.size;
    this.save();
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
   * Deletes entries from the primary STBL and saves the project to storage.
   * 
   * @param ids IDs of entries to delete
   */
  deleteEntries(ids: number[]) {
    ids.forEach(id => {
      this.primaryStbl.delete(id);
    });

    this.numStrings = this.primaryStbl.size;
    this.save();
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
