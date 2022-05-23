import type { ProjectData, StoredProject, UserSettings } from "../global";
import { getInstanceBase } from "./helpers/tgi";

const { Buffer } = window.S4TK.Node;
const { Package } = window.S4TK.models;
const { StringTableLocale, BinaryResourceType } = window.S4TK.enums;

//#region Settings

interface StoredSetting<T> {
  get: (setting: string, defaultValue?: T) => T;
  set: (setting: string, value: T) => void;
}

function getSettingStorageKey(setting: string): string {
  return "s:" + setting;
}

const StoredString: StoredSetting<string> = {
  get(prop: string, defaultValue: string = "") {
    return localStorage.getItem(getSettingStorageKey(prop)) ?? defaultValue;
  },
  set(prop: string, value: string) {
    localStorage.setItem(getSettingStorageKey(prop), value);
  }
};

const StoredBoolean: StoredSetting<boolean> = {
  get(prop: string, defaultValue: boolean = false) {
    const value = localStorage.getItem(getSettingStorageKey(prop));
    return value ? value === "true" : defaultValue;
  },
  set(prop: string, value: boolean) {
    localStorage.setItem(getSettingStorageKey(prop), value ? "true" : "false");
  }
};

const StoredInteger: StoredSetting<number> = {
  get(prop: string, defaultValue: number = 0) {
    const value = localStorage.getItem(getSettingStorageKey(prop));
    return value ? parseInt(value) : defaultValue;
  },
  set(prop: string, value: number) {
    localStorage.setItem(getSettingStorageKey(prop), value.toString());
  }
};

const StoredStringList: StoredSetting<string[]> = {
  get(prop: string, defaultValue: string[] = []) {
    const value = localStorage.getItem(getSettingStorageKey(prop));
    return value ? JSON.parse(value) as string[] : defaultValue;
  },
  set(prop: string, value: string[]) {
    localStorage.setItem(getSettingStorageKey(prop), JSON.stringify(value));
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

async function restoreSettings(settingsToRestore: Partial<UserSettings>) {
  for (const [key, value] of Object.entries(settingsToRestore)) {
    settings[key] = value;
  }
}

//#endregion Settings

//#region Projects

function getProjectStorageKey(uuid: string): string {
  return "p:" + uuid;
}

/**
 * Converts stored project data into an actual project data object.
 * 
 * @param uuid UUID of project to read
 * @param stored Data model of stored project
 */
function readProjectData(uuid: string, stored: StoredProject): ProjectData {
  const buffer = Buffer.from(stored.data, "base64");
  const stblEntries = Package.extractResources(buffer);
  const primary = stblEntries[0];

  return {
    uuid,
    name: stored.name,
    group: primary.key.group,
    instanceBase: getInstanceBase(primary.key.instance),
    primaryLocale: StringTableLocale.getLocale(primary.key.instance),
    stbls: stblEntries.map(entry => {
      return {
        locale: StringTableLocale.getLocale(entry.key.instance),
        stbl: entry.value as any,
      };
    })
  };
}

/**
 * Converts a project into an object that can be written to localStorage.
 * 
 * @param project Project to convert
 */
function writeProjectData(project: ProjectData): StoredProject {
  const entries = project.stbls.map(wrapper => {
    return {
      key: {
        type: BinaryResourceType.StringTable,
        group: project.group,
        instance: StringTableLocale.setHighByte(wrapper.locale, project.instanceBase)
      },
      value: wrapper.stbl
    };
  });

  const pkg = new Package(entries);

  return {
    name: project.name,
    data: pkg.getBuffer().toString("base64")
  };
}

/**
 * Loads and returns a project from localStorage.
 * 
 * @param uuid UUID of project to load
 */
function loadProjectData(uuid: string): ProjectData {
  const json = localStorage.getItem(getProjectStorageKey(uuid));
  if (!json) return undefined;
  const stored: StoredProject = JSON.parse(json);
  return readProjectData(uuid, stored);
}

/**
 * Saves a project to localStorage.
 * 
 * @param project Project to save
 */
async function saveProjectData(project: ProjectData) {
  const stored: StoredProject = writeProjectData(project);
  const json = JSON.stringify(stored);
  localStorage.setItem(getProjectStorageKey(project.uuid), json);
}

/**
 * Deletes a project from localStorage.
 * 
 * @param uuid UUID of project to delete
 */
async function deleteProjectData(uuid: string) {
  const projectUuids = settings.projectUuids;
  const uuidIndex = projectUuids.findIndex(value => value === uuid);
  if (uuidIndex != -1) {
    projectUuids.splice(uuidIndex, 1);
    settings.projectUuids = projectUuids;
  }

  localStorage.removeItem(getProjectStorageKey(uuid));
}

//#endregion Projects

//#region General

function byteLength(value: string): number {
  return window.S4TK.Node.Buffer.byteLength(value);
}

function getTotalBytesUsed(): number {
  let total = 0;

  for (const prop in localStorage) {
    if (typeof localStorage[prop] !== "string") continue;
    total += byteLength(prop) + byteLength(localStorage[prop]);
  }

  return total;
}

//#endregion General

const settings = getSettingsProxy({
  creatorName: StoredString,
  defaultLocale: StoredInteger,
  hasWorkspace: StoredBoolean,
  isLightTheme: StoredBoolean,
  projectUuids: StoredStringList,
});

const StorageService = {
  settings,
  restoreSettings,
  readProjectData,
  writeProjectData,
  loadProjectData,
  saveProjectData,
  deleteProjectData,
  getTotalBytesUsed,
};

export default StorageService;
