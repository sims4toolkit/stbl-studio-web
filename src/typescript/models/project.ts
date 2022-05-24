import type { StringTableResource as StblResourceType } from "@s4tk/models";
import type { StringTableLocale as StblLocaleType } from "@s4tk/models/enums";
import type { ProjectMetaData, StblMap } from "../../global";
import { v4 as uuidv4 } from "uuid";
import { getInstanceBase } from "../helpers/tgi";
import StorageService from "../storage";

const { StringTableResource } = window.S4TK.models;
const { compressBuffer, decompressBuffer, CompressionType } = window.S4TK.compression;
const { BinaryEncoder, BinaryDecoder } = window.S4TK.encoding;
const { fnv64 } = window.S4TK.hashing;
const { Buffer } = window.S4TK.Node;

/**
 * A project that contains string tables and associated meta data.
 */
export default class Project implements ProjectMetaData {
  group: number;
  instanceBase: bigint;
  name: string;
  numLocales: number;
  primaryLocale: StblLocaleType;
  readonly uuid: string;

  private _stblMap: StblMap;
  get stblMap() {
    return this._stblMap ??= StorageService.loadStblMap(this.uuid);
  }

  //#region Initialization

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
    this.primaryLocale = data.primaryLocale ?? StorageService.settings.defaultLocale;
    this.numLocales = data.numLocales ?? stblMap?.size ?? 1;

    if (!this.stblMap.has(this.primaryLocale))
      this.addLocale(this.primaryLocale);

    otherLocales?.forEach(locale => {
      if (!this.stblMap.has(locale))
        this.addLocale(locale);
    });
  }

  /**
   * Parses a StblMap from a buffer.
   * 
   * @param buffer Buffer containing stbl binaries
   */
  static parseBinaryStblMap(buffer: Buffer): StblMap {
    const decoder = new BinaryDecoder(buffer);
    decoder.skip(2); // version not needed yet

    const numStbls = decoder.uint8();

    const data: Partial<ProjectMetaData> = {
      uuid,
      primaryLocale: decoder.uint8(),
      group: decoder.uint32(),
      instanceBase: decoder.uint64(),
      name: decoder.string(),
    };

    const stblMap: Map<StblLocaleType, StblResourceType> = new Map();
    for (let i = 0; i < numStbls; i++) {
      const locale = decoder.uint8();
      const length = decoder.uint32();

      let stbl = length === 0
        ? new StringTableResource()
        : StringTableResource.from(decompressBuffer(
          decoder.slice(length),
          CompressionType.ZLIB
        ));

      stblMap.set(locale, stbl);
    }

    return new Project(data);
  }

  //#endregion Initialization

  //#region Getters/Setters

  /**
   * List of all locales in this project.
   */
  get allLocales(): StblLocaleType[] {
    return Array.from(this.stblMap.keys());
  }

  /**
   * The string table of the primary locale. 
   */
  get primaryStbl(): StblResourceType {
    return this.stblMap.get(this.primaryLocale);
  }

  //#endregion Getters/Setters

  //#region Methods

  /**
   * Adds a STBL for the specified locale.
   * 
   * @param locale Locale to add STBL for
   */
  addLocale(locale: StblLocaleType) {
    this.stblMap.set(locale, new StringTableResource());
  }

  /**
   * Saves this project into localStorage.
   */
  save() {
    StorageService.saveProjectData(this);
  }

  /**
   * Serializes this project into a buffer.
   */
  serialize(): Buffer {

  }

  //#endregion Methods
}
