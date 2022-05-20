import { StringTableResource } from "@s4tk/models";
import type { ProjectData, StoredProject, UserSettings } from "../global";

//#region Settings

interface StoredSetting<T> {
  get: (setting: string, defaultValue?: T) => T;
  set: (setting: string, value: T) => void;
}

const StoredString: StoredSetting<string> = {
  get(prop: string, defaultValue: string = "") {
    return localStorage.getItem(prop) ?? defaultValue;
  },
  set(prop: string, value: string) {
    localStorage.setItem(prop, value);
  }
};

const StoredBoolean: StoredSetting<boolean> = {
  get(prop: string, defaultValue: boolean = true) {
    const value = localStorage.getItem(prop);
    return value ? value === "true" : defaultValue;
  },
  set(prop: string, value: boolean) {
    localStorage.setItem(prop, value ? "true" : "false");
  }
};

const StoredInteger: StoredSetting<number> = {
  get(prop: string, defaultValue: number = 0) {
    const value = localStorage.getItem(prop);
    return value ? parseInt(value) : defaultValue;
  },
  set(prop: string, value: number) {
    localStorage.setItem(prop, value.toString());
  }
};

const StoredStringList: StoredSetting<string[]> = {
  get(prop: string, defaultValue: string[] = []) {
    const value = localStorage.getItem(prop);
    return value ? JSON.parse(value) as string[] : defaultValue;
  },
  set(prop: string, value: string[]) {
    localStorage.setItem(prop, JSON.stringify(value));
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

function getStorageKey(uuid: string): string {
  return "project:" + uuid;
}

/**
 * Converts stored project data into an actual project data object.
 * 
 * @param uuid UUID of project to read
 * @param stored Data model of stored project
 */
function readProjectData(uuid: string, stored: StoredProject): ProjectData {
  return {
    uuid,
    group: stored.group,
    instanceBase: BigInt(stored.instanceBase),
    name: stored.name,
    primaryLocale: stored.primaryLocale,
    stbls: stored.stbls.map(stbl => {
      const buffer = Buffer.from(stbl.data, "base64");
      const parsedStbl = StringTableResource.from(buffer);

      return {
        locale: stbl.locale,
        stbl: parsedStbl,
        updatedKeys: new Set<number>(stbl.updatedKeys)
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
  return {
    group: project.group,
    instanceBase: project.instanceBase.toString(16),
    name: project.name,
    primaryLocale: project.primaryLocale,
    stbls: project.stbls.map(wrapper => {
      const buffer: Buffer = wrapper.stbl.getBuffer(true);

      return {
        locale: wrapper.locale,
        updatedKeys: [...wrapper.updatedKeys],
        data: buffer.toString("base64")
      };
    })
  };
}

/**
 * Loads and returns a project from localStorage.
 * 
 * @param uuid UUID of project to load
 */
function loadProjectData(uuid: string): ProjectData {
  const value = localStorage.getItem(getStorageKey(uuid));
  if (!value) return undefined;
  const stored: StoredProject = JSON.parse(value);
  return readProjectData(uuid, stored);
}

/**
 * Saves a project to localStorage.
 * 
 * @param project Project to save
 */
async function saveProjectData(project: ProjectData) {
  const stored: StoredProject = writeProjectData(project);
  const value = JSON.stringify(stored);
  localStorage.setItem(getStorageKey(project.uuid), value);
}

//#endregion Projects

const settings = getSettingsProxy({
  creatorName: StoredString,
  defaultLocale: StoredInteger,
  isDarkTheme: StoredBoolean,
  projectUuids: StoredStringList,
});

const StorageService = {
  settings,
  restoreSettings,
  readProjectData,
  writeProjectData,
  loadProjectData,
  saveProjectData,
};

export default StorageService;
