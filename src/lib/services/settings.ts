import type { StringTableLocale } from "@s4tk/models/enums";
import StorageService from "./storage.js";
const { enums } = window.S4TK;

//#region Abstract Types

type OnChangeCallback<T> = (value: T) => void;

abstract class StoredSetting<T> {
  //#region Properties

  private _onChangeCallbacks: OnChangeCallback<T>[] = [];

  //#endregion Properties

  constructor(
    public readonly name: string,
    public readonly defaultValue: T
  ) { }

  //#region Public Methods

  get(setting: string): T {
    const stringValue = StorageService.readSetting(setting);
    return stringValue ? this._parseValue(stringValue) : this.defaultValue;
  }

  set(setting: string, value: T): void {
    StorageService.writeSetting(setting, this._stringifyValue(value));
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
  constructor(name: string, defaultValue = false) {
    super(name, defaultValue);
  }

  protected _parseValue(value: string): boolean {
    return value === "true";
  }

  protected _stringifyValue(value: boolean): string {
    return value ? "true" : "false";
  }
}

class StoredInteger extends StoredSetting<number> {
  constructor(name: string, defaultValue = 0) {
    super(name, defaultValue);
  }

  protected _parseValue(value: string): number {
    return parseInt(value);
  }

  protected _stringifyValue(value: number): string {
    return value.toString();
  }
}

class StoredStringArray extends StoredSetting<string[]> {
  constructor(name: string, defaultValue = []) {
    super(name, defaultValue);
  }

  protected _parseValue(value: string): string[] {
    return JSON.parse(value);
  }

  protected _stringifyValue(value: string[]): string {
    return JSON.stringify(value);
  }
}

//#endregion Classes

//#region Settings

interface UserSettings {
  defaultLocale: StringTableLocale;
  entriesPerPage: number;
  hasWorkspace: boolean;
  disableBlur: boolean;
  isLightTheme: boolean;
  projectUuids: string[]
  reduceMotion: boolean;
  showAllStrings: boolean;
  showTranslateKeys: boolean;
}

type StoredUserSettings = {
  [T in keyof UserSettings]: StoredSetting<UserSettings[T]>;
};

type StoredUserSettingsBuilder = {
  [T in keyof UserSettings]: [
    new (name: string, defaultValue: UserSettings[T])
      => StoredSetting<UserSettings[T]>,
    UserSettings[T]
  ];
};

function getSettingsProxy(settingsBuilder: StoredUserSettingsBuilder): UserSettings {
  const settings: Partial<StoredUserSettings> = {};
  for (const settingName in settingsBuilder) {
    const [cls, defaultValue] = settingsBuilder[settingName];
    settings[settingName] = new cls(settingName, defaultValue);
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
  defaultLocale: [StoredInteger, enums.StringTableLocale.English],
  entriesPerPage: [StoredInteger, 12],
  hasWorkspace: [StoredBoolean, false],
  disableBlur: [StoredBoolean, false],
  isLightTheme: [StoredBoolean, false],
  projectUuids: [StoredStringArray, []],
  reduceMotion: [StoredBoolean, false],
  showAllStrings: [StoredBoolean, false],
  showTranslateKeys: [StoredBoolean, false],
});

export default Settings;

//#endregion Settings
