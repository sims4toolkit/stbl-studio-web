import type { ProjectMetaData, StblMap, UserSettings, WorkspaceJson } from "../global";
import type Project from "./models/project";

const { StringTableResource } = window.S4TK.models;
const { BinaryDecoder, BinaryEncoder } = window.S4TK.encoding;
const { compressBuffer, decompressBuffer, CompressionType } = window.S4TK.compression;
const { Buffer } = window.S4TK.Node;

//#region General

function byteLength(value: string): number {
  return Buffer.byteLength(value);
}

/**
 * Returns the total number of bytes currently used by localStorage.
 */
export function getTotalBytesUsed(): number {
  let total = 0;

  for (const prop in localStorage) {
    if (typeof localStorage[prop] !== "string") continue;
    total += byteLength(prop) + byteLength(localStorage[prop]);
  }

  return total;
}

//#endregion General

//#region Key Generators

const settingKey = (uuid: string) => "s:" + uuid;
const projectKey = (uuid: string) => "p:" + uuid;
const stblMapKey = (uuid: string) => "m:" + uuid;

//#endregion Key Generators

//#region Settings

interface StoredSetting<T> {
  get: (setting: string, defaultValue?: T) => T;
  set: (setting: string, value: T) => void;
}

const StoredString: StoredSetting<string> = {
  get(prop: string, defaultValue: string = "") {
    return localStorage.getItem(settingKey(prop)) ?? defaultValue;
  },
  set(prop: string, value: string) {
    localStorage.setItem(settingKey(prop), value);
  }
};

const StoredBoolean: StoredSetting<boolean> = {
  get(prop: string, defaultValue: boolean = false) {
    const value = localStorage.getItem(settingKey(prop));
    return value ? value === "true" : defaultValue;
  },
  set(prop: string, value: boolean) {
    localStorage.setItem(settingKey(prop), value ? "true" : "false");
  }
};

const StoredInteger: StoredSetting<number> = {
  get(prop: string, defaultValue: number = 0) {
    const value = localStorage.getItem(settingKey(prop));
    return value ? parseInt(value) : defaultValue;
  },
  set(prop: string, value: number) {
    localStorage.setItem(settingKey(prop), value.toString());
  }
};

const StoredStringList: StoredSetting<string[]> = {
  get(prop: string, defaultValue: string[] = []) {
    const value = localStorage.getItem(settingKey(prop));
    return value ? JSON.parse(value) as string[] : defaultValue;
  },
  set(prop: string, value: string[]) {
    localStorage.setItem(settingKey(prop), JSON.stringify(value));
  }
};

function getSettingsProxy(settings: object): UserSettings {
  return new Proxy(settings, {
    get(target, prop) {
      return target[prop].get(prop);
    },
    set(target, prop, value) {
      target[prop].set(prop, value);
      return true;
    }
  }) as unknown as UserSettings;
}

/**
 * Overwrites the given settings in localStorage.
 * 
 * @param settings Object of settings to overwrite 
 */
export async function overwriteSettings(settings: Partial<UserSettings>) {
  for (const [key, value] of Object.entries(settings)) {
    Settings[key] = value;
  }
}

/**
 * Interface for all user settings and single values.
 */
export const Settings = getSettingsProxy({
  creatorName: StoredString,
  defaultLocale: StoredInteger,
  hasWorkspace: StoredBoolean,
  isLightTheme: StoredBoolean,
  projectUuids: StoredStringList,
});

//#endregion Settings

//#region Projects

function readProjectMetaData(uuid: string, base64: string): ProjectMetaData {
  const buffer = Buffer.from(base64, "base64");
  const decoder = new BinaryDecoder(buffer);

  decoder.skip(1); // don't need version

  return {
    uuid,
    primaryLocale: decoder.uint8(),
    numLocales: decoder.uint8(),
    numStrings: decoder.uint32(),
    group: decoder.uint32(),
    instanceBase: decoder.uint64(),
    name: decoder.string(),
  };
}

/**
 * Loads project meta data from localStorage.
 * 
 * @param uuid UUID of project data to load
 */
export function loadProjectMetaData(uuid: string): ProjectMetaData {
  const base64 = localStorage.getItem(projectKey(uuid));
  return readProjectMetaData(uuid, base64);
}

/**
 * Saves project meta data to localStorage.
 * 
 */
export async function saveProjectMetaData(data: ProjectMetaData) {
  const buffer = Buffer.alloc(20 + byteLength(data.name)); // +1 for null
  const encoder = new BinaryEncoder(buffer);

  encoder.uint8(0); // version
  encoder.uint8(data.primaryLocale);
  encoder.uint8(data.numLocales);
  encoder.uint32(data.numStrings);
  encoder.uint32(data.group);
  encoder.uint64(data.instanceBase);
  encoder.charsUtf8(data.name);
  // last byte is null for name string

  const base64 = buffer.toString("base64");
  localStorage.setItem(projectKey(data.uuid), base64);
}

function readStblMap(base64: string): StblMap {
  const buffer = Buffer.from(base64, "base64");
  const decoder = new BinaryDecoder(buffer);

  decoder.skip(1); // don't need version

  const numStbls = decoder.uint8();

  const stblMap: StblMap = new Map();

  for (let i = 0; i < numStbls; i++) {
    const locale = decoder.uint8();
    const length = decoder.uint32();

    let stbl = length === 0
      ? new StringTableResource()
      : StringTableResource.from(
        decompressBuffer(
          decoder.slice(length),
          CompressionType.ZLIB
        )
      );

    stblMap.set(locale, stbl);
  }

  return stblMap;
}

/**
 * Loads a stbl map from localStorage.
 * 
 * @param uuid UUID of stbl map to load
 */
export function loadStblMap(uuid: string): StblMap {
  const base64 = localStorage.getItem(stblMapKey(uuid));
  return readStblMap(base64);
}

/**
 * Saves a stbl map to localStorage.
 * 
 * @param uuid UUID of stbl map to save
 * @param stblMap Stbl map to save
 */
export async function saveStblMap(uuid: string, stblMap: StblMap) {
  const headerBuffer = Buffer.alloc(2);
  const headerBufferEncoder = new BinaryEncoder(headerBuffer);
  headerBufferEncoder.uint8(0); // version
  headerBufferEncoder.uint8(stblMap.size);

  const allBuffers: Buffer[] = [headerBuffer];

  stblMap.forEach((stbl, locale) => {
    const stblHeaderBuffer = Buffer.alloc(5); // locale + length
    const stblHeaderBufferEncoder = new BinaryEncoder(stblHeaderBuffer);

    if (stbl.size === 0) {
      stblHeaderBufferEncoder.uint8(locale);
      stblHeaderBufferEncoder.uint32(0);
      allBuffers.push(stblHeaderBuffer);
    } else {
      const stblBuffer = compressBuffer(
        stbl.getBuffer(true),
        CompressionType.ZLIB
      );

      stblHeaderBufferEncoder.uint8(locale);
      stblHeaderBufferEncoder.uint32(stblBuffer.byteLength);
      allBuffers.push(stblHeaderBuffer, stblBuffer);
    }
  });

  const base64 = Buffer.concat(allBuffers).toString("base64");
  localStorage.setItem(stblMapKey(uuid), base64);
}

/**
 * Adds a project to localStorage.
 * 
 * @param project Project to add
 */
export async function addProject(project: Project) {
  const { projectUuids } = Settings;
  projectUuids.push(project.uuid)
  Settings.projectUuids = projectUuids; // to save

  saveProjectMetaData(project);
  saveStblMap(project.uuid, project.stblMap);
}

/**
 * Deletes all data associated with a project from localStorage.
 * 
 * @param uuid UUID of project to delete
 */
export async function deleteProject(uuid: string) {
  const { projectUuids } = Settings;
  const uuidIndex = projectUuids.findIndex(value => value === uuid);
  if (uuidIndex !== -1) {
    projectUuids.splice(uuidIndex, 1);
    Settings.projectUuids = projectUuids; // to save
  }

  localStorage.removeItem(projectKey(uuid));
  localStorage.removeItem(stblMapKey(uuid));
}

//#endregion Projects

//#region Workspace

/**
 * Overwrites all localStorage with the given workspace data.
 * 
 * @param workspace Workspace JSON to restore
 */
export async function overwriteWorkspace(workspace: WorkspaceJson) {
  localStorage.clear();
  overwriteSettings(workspace.settings);

  let projectUuids: string[] = [];
  workspace.projects.forEach(project => {
    projectUuids.push(project.uuid);
    localStorage.setItem(projectKey(project.uuid), project.metaData);
    localStorage.setItem(stblMapKey(project.uuid), project.stblMap);
  });

  Settings.projectUuids = projectUuids;
  Settings.hasWorkspace = true;
}

/**
 * Creates a JSON that represents the workspace.
 */
export function getWorkspaceJson(): WorkspaceJson {
  return {
    version: 0,
    settings: {
      creatorName: Settings.creatorName,
      defaultLocale: Settings.defaultLocale,
      isLightTheme: Settings.isLightTheme
    },
    projects: Settings.projectUuids.map(uuid => {
      return {
        uuid,
        metaData: localStorage.getItem(projectKey(uuid)),
        stblMap: localStorage.getItem(stblMapKey(uuid))
      };
    })
  };
}

//#endregion Workspace
