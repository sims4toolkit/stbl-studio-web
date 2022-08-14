import type { StringTableLocale } from "@s4tk/models/enums";
import DatabaseService from "../services/database.js";
import LocalizedStringTable from "./localized-stbl.js";
const { encoding, enums } = window.S4TK;
const { Buffer } = window.S4TK.Node;

/**
 * Object containing meta data associated with a project.
 */
interface ProjectMetaData {
  group: number;
  instance: bigint;
  name: string;
  numEntries: number; // view only; use stbl for logic
  numLocales: number; // view only; use stbl for logic
  primaryLocale: StringTableLocale; // view only; use stbl for logic
}

/**
 * A model for projects in STBL studio.
 */
export default class Project {
  static readonly META_DATA_VERSION = 0;

  //#region Getters / Setters

  get metaData() { return this._metaData; }

  get stbl() {
    if (this._stbl) return this._stbl;
    throw new Error("Project STBL was accessed before being loaded.");
  }

  //#endregion Getters / Setters

  //#region Initialization

  constructor(
    public readonly uuid: string,
    private _metaData: ProjectMetaData,
    private _stbl?: LocalizedStringTable
  ) { }

  /**
   * Creates a project with the given UUID and meta data parsed from the given
   * Base64-encoded string.
   * 
   * @param uuid UUID of project to create
   * @param metaData String to deserialize as a ProjectMetaData object
   */
  static deserialize(uuid: string, metaData: string): Project {
    return new Project(uuid, Project.deserializeMetaData(metaData));
  }

  /**
   * Parses a Base64-encoded string as a ProjectMetaData object.
   * 
   * @param string String to deserialize
   */
  static deserializeMetaData(string: string): ProjectMetaData {
    const metaData: Partial<ProjectMetaData> = {};

    const decoder = new encoding.BinaryDecoder(Buffer.from(string, "base64"));
    decoder.skip(1); // version unneeded right now
    metaData.group = decoder.uint32();
    const fullInstance = decoder.uint64();
    metaData.primaryLocale = enums.StringTableLocale.getLocale(fullInstance);
    metaData.instance = enums.StringTableLocale.getInstanceBase(fullInstance);
    metaData.numLocales = decoder.uint8();
    metaData.numEntries = decoder.uint32();
    metaData.name = decoder.string();

    return metaData as ProjectMetaData;
  }

  /**
   * Loads the project with the given UUID from storage.
   * 
   * @param uuid UUID of project to load
   */
  static async fromStorage(uuid: string): Promise<Project> {
    return new Promise((resolve, reject) => {
      DatabaseService.getItem("metadata", uuid)
        .then(metaData => {
          resolve(Project.deserialize(uuid, metaData));
        }).catch(err => {
          reject(err);
        });
    });
  }

  //#endregion Initialization

  //#region Public Methods

  /**
   * Loads the STBL for this project from storage.
   */
  async loadStringTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._stbl) return resolve();

      DatabaseService.getItem("stbls", this.uuid)
        .then(data => {
          if (!data) return reject("Could not deserialize STBL.");
          this._stbl = LocalizedStringTable.deserialize(data);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Serializes the meta data for this project into a Base64-encoded string.
   */
  serializeMetaData(): string {
    // version, numLocales == 1 byte each (2 total)
    // group, numEntries == 4 bytes each (8 total)
    // instance + primary locale == 8 bytes
    // string terminator == 1 byte
    const size = 19 + Buffer.byteLength(this.metaData.name);
    const buffer = Buffer.alloc(size);
    const encoder = new encoding.BinaryEncoder(buffer);

    const fullInstance = enums.StringTableLocale.setHighByte(
      this.metaData.primaryLocale,
      this.metaData.instance
    );

    encoder.uint8(Project.META_DATA_VERSION);
    encoder.uint32(this.metaData.group);
    encoder.uint64(fullInstance);
    encoder.uint8(this.metaData.numLocales);
    encoder.uint32(this.metaData.numEntries);
    encoder.charsUtf8(this.metaData.name);

    return buffer.toString("base64");
  }

  //#endregion Public Methods
}
