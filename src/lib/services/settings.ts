import type { StringTableLocale } from "@s4tk/models/enums";
import DocumentUtils from "src/lib/utilities/document.js";
import StorageService from "src/lib/services/storage.js";

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
    return parseInt(value);
  }

  protected _stringifyValue(value: number): string {
    return value.toString();
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
  reduceMotion: boolean;
  showAllStrings: boolean;
  showTranslateKeys: boolean;
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
    defaultValue: 12
  },
  hasWorkspace: {
    cls: StoredBoolean
  },
  disableBlur: {
    cls: StoredBoolean,
    callbacks: [
      DocumentUtils.toggleBlurEffect
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
  showTranslateKeys: {
    cls: StoredBoolean
  },
});

export default Settings;

//#endregion Settings
