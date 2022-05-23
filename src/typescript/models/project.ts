import type { StringTableResource as StblType } from "@s4tk/models";
import type { StringTableLocale as StblLocaleType } from "@s4tk/models/enums";
import type { ProjectData } from "../../global";
import { v4 as uuidv4 } from "uuid";
import { getInstanceBase } from "../helpers/tgi";
import StorageService from "../storage-service";

const { StringTableResource } = window.S4TK.models;
const { compressBuffer, decompressBuffer, CompressionType } = window.S4TK.compression;
const { BinaryEncoder, BinaryDecoder } = window.S4TK.encoding;
const { fnv64 } = window.S4TK.hashing;
const { Buffer } = window.S4TK.Node;

/**
 * A project that contains string tables and associated meta data.
 */
export default class Project implements ProjectData {
  group: number;
  instanceBase: bigint;
  name: string;
  primaryLocale: StblLocaleType;
  readonly stblMap: Map<StblLocaleType, StblType>;
  readonly uuid: string;

  //#region Initialization

  /**
   * Creates a new STBL from given data.
   * 
   * @param data Partial data to create project from
   * @param otherLocales Optional list of locales to ensure are in this STBL
   */
  constructor(
    data: Partial<ProjectData>,
    otherLocales?: StblLocaleType[]
  ) {
    this.uuid = data.uuid ?? uuidv4();
    this.name = data.name ?? this.uuid;
    this.group = data.group ?? 0;
    this.instanceBase = data.instanceBase ?? getInstanceBase(fnv64(this.uuid));
    this.primaryLocale = data.primaryLocale ?? StorageService.settings.defaultLocale;
    this.stblMap = data.stblMap ?? new Map();

    if (!this.stblMap.has(this.primaryLocale))
      this.addLocale(this.primaryLocale);

    otherLocales?.forEach(locale => {
      if (!this.stblMap.has(locale))
        this.addLocale(locale);
    });
  }

  /**
   * Parses a project from a buffer.
   * 
   * @param buffer Buffer containing project data
   */
  static from(buffer: Buffer): Project {
    const decoder = new BinaryDecoder(buffer);
    decoder.skip(2); // version not needed yet

    const numStbls = decoder.uint8();

    const data: Partial<ProjectData> = {
      primaryLocale: decoder.uint8(),
      group: decoder.uint32(),
      instanceBase: decoder.uint64(),
      uuid: decoder.string(),
      name: decoder.string(),
    };

    const stblMap: Map<StblLocaleType, StblType> = new Map();
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
  get primaryStbl(): StblType {
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
    // project header
    let headerSize = 2 + 1 + 1 + 4 + 8;
    headerSize += Buffer.byteLength(this.uuid) + 1; // +1 for null
    headerSize += Buffer.byteLength(this.name) + 1; // +1 for null
    const headerBuffer = Buffer.alloc(headerSize);
    const headerBufferEncoder = new BinaryEncoder(headerBuffer);
    headerBufferEncoder.uint16(0); // version
    headerBufferEncoder.uint8(this.stblMap.size);
    headerBufferEncoder.uint8(this.primaryLocale);
    headerBufferEncoder.uint32(this.group);
    headerBufferEncoder.uint64(this.instanceBase);
    headerBufferEncoder.charsUtf8(this.uuid);
    headerBufferEncoder.skip(1); // null
    headerBufferEncoder.charsUtf8(this.name);
    headerBufferEncoder.skip(1); // null

    // list to concat later
    const allBuffers: Buffer[] = [headerBuffer];

    // stbls data
    this.stblMap.forEach((stbl, locale) => {
      // individual stbl header
      const stblHeaderBuffer = Buffer.alloc(5); // locale + length
      const stblHeaderBufferEncoder = new BinaryEncoder(stblHeaderBuffer);

      if (stbl.size === 0) {
        stblHeaderBufferEncoder.uint8(locale);
        stblHeaderBufferEncoder.uint32(0);
        allBuffers.push(stblHeaderBuffer);
      } else {
        const stblBuffer = compressBuffer(stbl.getBuffer(true), CompressionType.ZLIB);
        stblHeaderBufferEncoder.uint8(locale);
        stblHeaderBufferEncoder.uint32(stblBuffer.byteLength);
        allBuffers.push(stblHeaderBuffer, stblBuffer);
      }
    });

    return Buffer.concat(allBuffers);
  }

  //#endregion Methods
}
