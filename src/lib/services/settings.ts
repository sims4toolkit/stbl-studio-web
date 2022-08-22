import { writable } from "svelte/store";
import type { StringTableLocale } from "@s4tk/models/enums";
import DocumentUtils from "src/lib/utilities/document.js";
import StorageService from "src/lib/services/storage.js";
import constants from "src/data/constants.json";

//#region Abstract Types

type OnChangeCallback<T> = (value: T) => void;

abstract class StoredSetting<T> {
  constructor(
    public readonly name: string,
    public readonly defaultValue: T,
    private _onChangeCallbacks: OnChangeCallback<T>[] = []
  ) { }

  //#region Public Methods

  get(setting: string): T {
    const stringValue = StorageService.getItem("s:" + setting);
    return stringValue ? this._parseValue(stringValue) : this.defaultValue;
  }

  set(setting: string, value: T): void {
    StorageService.setItem("s:" + setting, this._stringifyValue(value));
    this._onChange(value);
  }

  addCallback(cb: OnChangeCallback<T>) {
    this._onChangeCallbacks.push(cb);
  }

  //#endregion Public Methods

  //#region Protected Methods

  protected abstract _parseValue(value: string): T;

  protected abstract _stringifyValue(value: T): string;

  //#endregion Protected Methods

  //#region Private Methods

  private _onChange(value: T) {
    this._onChangeCallbacks.forEach(cb => cb(value));
  }

  //#endregion Private Methods
}

//#endregion Abstract Types

//#region Classes

class StoredBoolean extends StoredSetting<boolean> {
  constructor(
    name: string,
    defaultValue = false,
    callbacks?: OnChangeCallback<boolean>[]
  ) {
    super(name, defaultValue, callbacks);
  }

  protected _parseValue(value: string): boolean {
    return value === "true";
  }

  protected _stringifyValue(value: boolean): string {
    return value ? "true" : "false";
  }
}

class StoredInteger extends StoredSetting<number> {
  constructor(
    name: string,
    defaultValue = 0,
    callbacks?: OnChangeCallback<number>[]
  ) {
    super(name, defaultValue, callbacks);
  }

  protected _parseValue(value: string): number {
    const number = parseInt(value);
    return Number.isNaN(number) ? this.defaultValue : number;
  }

  protected _stringifyValue(value: number): string {
    return value.toString();
  }
}

class StoredString<T extends string = string> extends StoredSetting<T> {
  constructor(
    name: string,
    defaultValue?: T,
    callbacks?: OnChangeCallback<string>[]
  ) {
    super(name, defaultValue, callbacks);
  }

  protected _parseValue(value: string): T {
    return value as T;
  }

  protected _stringifyValue(value: T): string {
    return value;
  }
}

class StoredJson<T extends object> extends StoredSetting<T> {
  constructor(
    name: string,
    defaultValue?: T,
    callbacks?: OnChangeCallback<T>[]
  ) {
    super(name, defaultValue, callbacks);
  }

  protected _parseValue(value: string): T {
    return JSON.parse(value);
  }

  protected _stringifyValue(value: T): string {
    return JSON.stringify(value);
  }
}

//#endregion Classes

//#region Settings

type EasterEgg = "rickroll" | "hacker" | "pride" | "womp";

interface UserSettings {
  defaultLocale: StringTableLocale;
  entriesPerPage: number;
  hasWorkspace: boolean;
  disableBlur: boolean;
  disableToolbarColors: boolean;
  isLightTheme: boolean;
  reduceMotion: boolean;
  showAllStrings: boolean;
  mainframeHacked: boolean;
  rickGif: boolean;
  foundEasterEggs: EasterEgg[];
  disableEasterEggs: boolean;
  projectView: number;
  downloadFileType: FileDownloadType;
  downloadLocales: number;
  downloadNamingConvention: FileNamingConvention;
}

type StoredUserSettings = {
  [T in keyof UserSettings]: StoredSetting<UserSettings[T]>;
};

type StoredUserSettingsBuilder = {
  [T in keyof UserSettings]: {
    cls: new (name: string, defaultValue: UserSettings[T])
      => StoredSetting<UserSettings[T]>,
    defaultValue?: UserSettings[T],
    callbacks?: OnChangeCallback<UserSettings[T]>[]
  };
};

function getSettingsProxy(settingsBuilder: StoredUserSettingsBuilder): UserSettings {
  const settings: Partial<StoredUserSettings> = {};
  for (const settingName in settingsBuilder) {
    const builder = settingsBuilder[settingName];
    settings[settingName] = new builder.cls(
      settingName,
      builder.defaultValue,
      builder.callbacks
    );
  }

  return new Proxy(settings as StoredUserSettings, {
    get(target, prop) {
      return target[prop].get(prop);
    },
    set(target, prop, value) {
      target[prop].set(prop, value);
      return true;
    }
  }) as unknown as UserSettings;
}

const Settings = getSettingsProxy({
  defaultLocale: {
    cls: StoredInteger
  },
  entriesPerPage: {
    cls: StoredInteger,
    defaultValue: 9
  },
  hasWorkspace: {
    cls: StoredBoolean
  },
  disableBlur: {
    cls: StoredBoolean,
    callbacks: [
      (value) => DocumentUtils.toggleBooleanAttribute("data-allow-blur", !value)
    ]
  },
  disableToolbarColors: {
    cls: StoredBoolean,
    callbacks: [
      (value) => DocumentUtils.toggleBooleanAttribute("data-monochrome-toolbar", value)
    ]
  },
  isLightTheme: {
    cls: StoredBoolean,
    callbacks: [
      (value) => DocumentUtils.toggleLightTheme(value, !Settings.reduceMotion)
    ]
  },
  reduceMotion: {
    cls: StoredBoolean
  },
  showAllStrings: {
    cls: StoredBoolean
  },
  mainframeHacked: {
    cls: StoredBoolean,
    callbacks: [
      (value) => {
        DocumentUtils.toggleBooleanAttribute("data-hacker-theme", value);
        if (value) {
          DocumentUtils.toggleLightTheme(false, false);
        } else {
          DocumentUtils.toggleLightTheme(Settings.isLightTheme, false);
        }
      },
      (value) => {
        mainframeHackedStore.set(value);
      }
    ]
  },
  rickGif: {
    cls: StoredBoolean,
    callbacks: [
      (value) => {
        rickGifStore.set(value);
      },
      (value) => {
        if (value) window.open(constants.links.rickRoll, "_blank");
      }
    ]
  },
  foundEasterEggs: {
    cls: StoredJson,
    defaultValue: []
  },
  disableEasterEggs: {
    cls: StoredBoolean
  },
  projectView: {
    cls: StoredInteger
  },
  downloadFileType: {
    cls: StoredString,
    defaultValue: "package"
  },
  downloadNamingConvention: {
    cls: StoredString,
    defaultValue: "project"
  },
  downloadLocales: {
    cls: StoredInteger,
    defaultValue: constants.specialValues.allLocales
  }
});

export default Settings;

//#endregion Settings

//#region Stores

function easterEggFoundCallback(easterEgg: EasterEgg) {
  return (value: boolean) => {
    if (value) {
      const foundList = Settings.foundEasterEggs;
      if (!foundList.includes(easterEgg)) {
        foundList.push(easterEgg);
        Settings.foundEasterEggs = foundList;
      }
    }
  };
}

export const mainframeHackedStore = writable(Settings.mainframeHacked);
mainframeHackedStore.subscribe(easterEggFoundCallback("hacker"));

export const rickGifStore = writable(Settings.rickGif);
rickGifStore.subscribe(easterEggFoundCallback("rickroll"));

export const prideFlagOverlayStore = writable(false);
prideFlagOverlayStore.subscribe(easterEggFoundCallback("pride"));

export const wompWompStore = writable(false);
wompWompStore.subscribe(easterEggFoundCallback("womp"));

//#endregion Stores
