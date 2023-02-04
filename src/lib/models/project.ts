import { v4 as uuidv4 } from "uuid";
import type { StringTableLocale } from "@s4tk/models/enums";
import DatabaseService from "src/lib/services/database.js";
import LocalizedStringTable from "src/lib/models/localized-stbl.js";
const { encoding, enums, hashing } = window.S4TK;
const { Buffer } = window.S4TK.Node;

/**
 * Object containing meta data associated with a project.
 */
interface ProjectMetaData {
  flags: number; // 32 bits
  group: number;
  instance: bigint;
  name: string;
  numEntries: number; // view only; use stbl for logic
  numLocales: number; // view only; use stbl for logic
  primaryLocale: StringTableLocale; // view only; use stbl for logic
}

/**
 * Boolean flags for project objects (max 32 bits).
 */
export enum ProjectFlags {
  Pinned = 1,
  Corrupt = 2,
}

/**
 * A model for projects in STBL studio.
 */
export default class Project {
  static readonly META_DATA_VERSION = 1;

  //#region Getters / Setters

  get metaData() { return this._metaData; }

  get stbl() {
    if (this._stbl) return this._stbl;
    throw new Error("Project STBL was accessed before being loaded.");
  }

  get hasStbl() {
    return this._stbl != undefined;
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

    const version = decoder.uint8();
    metaData.flags = version > 0 ? decoder.uint32() : 0;
    metaData.group = decoder.uint32();
    const fullInstance = decoder.uint64();
    metaData.primaryLocale = enums.StringTableLocale.getLocale(fullInstance);
    metaData.instance = enums.StringTableLocale.getInstanceBase(fullInstance);
    if (version === 0 && decoder.boolean()) metaData.flags |= ProjectFlags.Pinned;
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
   * Adds the given string to this project. All returns and newlines will be
   * replaced with literal "\n". The key will be the FNV-32 hash of this
   * project's UUID and another random UUID.
   * 
   * @param rawValue String value to add
   */
  addString(rawValue: string) {
    const value = rawValue.replace(/(?:\r\n|\r|\n)/g, "\\n");
    const key = hashing.fnv32(`${this.uuid}:${uuidv4()}`);
    this.stbl.addEntry(key, value);
    this.metaData.numEntries = this.stbl.numEntries;
    this.saveToStorage();
    this.stbl.saveToStorage(this.uuid);
  }

  /**
   * Deletes entries from the project and removes them from storage.
   * 
   * @param ids IDs of entries to delete
   */
  deleteStrings(ids: number[]) {
    ids.forEach(id => this.stbl.deleteEntry(id));
    this.metaData.numEntries = this.stbl.numEntries;
    this.saveToStorage();
    this.stbl.saveToStorage(this.uuid);
  }

  /**
   * Returns whether the given flag(s) is/are present on this project.
   * 
   * @param flag Flag(s) to check for
   */
  hasFlags(flags: ProjectFlags) {
    return Boolean(this.metaData.flags & flags);
  }

  /**
   * Imports strings to this project and saves it to storage.
   * 
   * @param stbl Stbl of entries to import
   * @param overwriteKeys Whether or not to overwrite entries with existing keys
   */
  importEntries(stbl: LocalizedStringTable, overwriteKeys: boolean) {
    this.stbl.importEntries(stbl, overwriteKeys);
    this.metaData.numEntries = this.stbl.numEntries;
    this.metaData.numLocales = this.stbl.numLocales;
    this.saveToStorage();
    this.stbl.saveToStorage(this.uuid);
  }

  /**
   * Sets the given flag(s) and saves the meta data.
   * 
   * @param flag Flag(s) to set
   * @param value Whether the flag(s) should be true or false
   */
  setFlags(flags: ProjectFlags, value: boolean) {
    if (value) {
      this.metaData.flags |= flags;
    } else {
      this.metaData.flags ^= flags;
    }

    this.saveToStorage(false);
  }

  /**
   * Updates the value for the entry with the given ID, then saves the STBL to
   * storage. This will replace newlines with literal "\n".
   * 
   * @param id ID of entry to update
   * @param rawValue New value of entry
   * @param locale Locale to set value for
   */
  setValue(id: number, rawValue: string, locale = this.stbl.primaryLocale) {
    const value = rawValue.replace(/(?:\r\n|\r|\n)/g, "\\n");
    this.stbl.setValue(id, value, locale);
    this.stbl.saveToStorage(this.uuid);
  }

  /**
   * Replaces the entries in this project and saves it to storage.
   * 
   * @param entries Entries to use
   */
  replaceEntries(entries: StringTableJson<number>) {
    this.stbl.replaceEntries(entries);
    this.metaData.numEntries = this.stbl.numEntries;
    this.saveToStorage();
    this.stbl.saveToStorage(this.uuid);
  }

  /**
   * Updates the keys in this project's STBL and then saves it to storage.
   * 
   * @param newKeys Array containing new keys
   */
  updateKeys(newKeys: { id: number; newKey: number; }[]) {
    newKeys.forEach(({ id, newKey }) => {
      this.stbl.getEntry(id).key = newKey;
    });

    this.stbl.saveToStorage(this.uuid);
  }

  /**
   * Loads the STBL for this project from storage.
   */
  async loadStringTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._stbl) return resolve();

      DatabaseService.getItem("stbls", this.uuid)
        .then(data => {
          if (!data) return reject("Could not deserialize STBL.");

          try {
            this._stbl = LocalizedStringTable.deserialize(data);
            if (this.hasFlags(ProjectFlags.Corrupt))
              this.setFlags(ProjectFlags.Corrupt, false);
          } catch (err) {
            this.setFlags(ProjectFlags.Corrupt, true);
            throw err;
          }

          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Writes this project's meta data to the DB.
   * 
   * @param requireStbl Whether or not to get locales/entries from STBL
   */
  async saveToStorage(requireStbl: boolean = true) {
    if (requireStbl) {
      this.metaData.numLocales = this.stbl.numLocales;
      this.metaData.numEntries = this.stbl.numEntries;
    }

    DatabaseService.setItem("metadata", this.uuid, this.serializeMetaData());
  }

  /**
   * Serializes the meta data for this project into a Base64-encoded string.
   */
  serializeMetaData(): string {
    // version, numLocales == 1 byte each (2 total)
    // flags == 4 bytes
    // group, numEntries == 4 bytes each (8 total)
    // instance + primary locale == 8 bytes
    // string terminator == 1 byte
    const size = 23 + Buffer.byteLength(this.metaData.name);
    const buffer = Buffer.alloc(size);
    const encoder = new encoding.BinaryEncoder(buffer);

    const fullInstance = enums.StringTableLocale.setHighByte(
      this.metaData.primaryLocale,
      this.metaData.instance
    );

    encoder.uint8(Project.META_DATA_VERSION);
    encoder.uint32(this.metaData.flags ?? 0);
    encoder.uint32(this.metaData.group);
    encoder.uint64(fullInstance);
    encoder.uint8(this.metaData.numLocales);
    encoder.uint32(this.metaData.numEntries);
    encoder.charsUtf8(this.metaData.name);

    return buffer.toString("base64");
  }

  //#endregion Public Methods
}
