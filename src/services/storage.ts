import type { ProjectData, StoredProject, UserSettings } from "../global";

//#region Settings

interface StoredSetting<T> {
  get: (setting: string, defaultValue?: T) => T;
  set: (setting: string, value: T) => void;
}

function getSettingStorageKey(setting: string): string {
  return "setting:" + setting;
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
      const buffer = window.S4TK.Node.Buffer.from(stbl.data, "base64");
      const parsedStbl = window.S4TK.models.StringTableResource.from(buffer);

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
    instanceBase: "0x" + project.instanceBase.toString(16),
    name: project.name,
    primaryLocale: project.primaryLocale,
    stbls: project.stbls.map(wrapper => {
      const buffer: Buffer = wrapper.stbl.getBuffer(true);

      return {
        locale: wrapper.locale,
        updatedKeys: wrapper.updatedKeys ? [...wrapper.updatedKeys] : null,
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
  const value = localStorage.getItem(getProjectStorageKey(uuid));
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
  localStorage.setItem(getProjectStorageKey(project.uuid), value);
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
};

export default StorageService;
