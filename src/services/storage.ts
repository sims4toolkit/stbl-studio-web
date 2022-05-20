import { StringTableResource } from "@s4tk/models";
import type { ProjectData, UserSettings } from "../global";

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

//#endregion Settings

//#region Projects

interface StoredProject {
  group: number;
  instanceBase: string; // hex, no prefix
  name: string;
  primaryLocale: number;
  stbls: {
    locale: number;
    data: string; // base64 binary
    updatedKeys: number[];
  }[];
}

function getStorageKey(uuid: string): string {
  return "project:" + uuid;
}

async function loadProjectData(uuid: string): Promise<ProjectData> {
  return new Promise((resolve, reject) => {
    const value = localStorage.getItem(getStorageKey(uuid));
    if (!value) return reject("No project with ID: " + uuid);

    const project: StoredProject = JSON.parse(value);

    resolve({
      uuid,
      group: project.group,
      instanceBase: BigInt(project.instanceBase),
      name: project.name,
      primaryLocale: project.primaryLocale,
      stbls: project.stbls.map(stbl => {
        const buffer = Buffer.from(stbl.data, "base64");
        const parsedStbl = StringTableResource.from(buffer);

        return {
          locale: stbl.locale,
          stbl: parsedStbl,
          updatedKeys: new Set<number>(stbl.updatedKeys)
        };
      })
    });
  });
}

async function saveProjectData(project: ProjectData) {
  const json: StoredProject = {
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

  const value = JSON.stringify(json);

  localStorage.setItem(getStorageKey(project.uuid), value);
}

//#endregion Projects

const settings: UserSettings = new Proxy({
  creatorName: StoredString,
  defaultLocale: StoredInteger,
  isDarkTheme: StoredBoolean,
  projectUuids: StoredStringList,
}, {
  get(target, prop) {
    return target[prop].get(prop);
  },
  set(target, prop, value) {
    target[prop].set(prop, value);
    return true;
  }
}) as unknown as UserSettings;

const StorageService = {
  settings,
  loadProjectData,
  saveProjectData
};

export default StorageService;
