import type { StringTableLocale } from "@s4tk/models/enums";
import { Writable, writable } from "svelte/store";
import type Workspace from "./models/workspace";
import { Settings } from "./storage";

export const activeWorkspace: Writable<Workspace> = writable(null);
export const numMovableWindowsStore = writable(0);

function createSettingStore<T>(name: string): Writable<T> {
  const store = writable(Settings[name]);

  store.subscribe(value => {
    Settings[name] = value;
  });

  return store;
}

export const isLightThemeStore = createSettingStore<boolean>("isLightTheme");
export const disableBlurStore = createSettingStore<boolean>("disableBlur");
export const reduceMotionStore = createSettingStore<boolean>("reduceMotion");
export const defaultLocaleStore = createSettingStore<StringTableLocale>("defaultLocale");
export const entriesPerPageStore = createSettingStore<number>("entriesPerPage");
export const showAllStringsStore = createSettingStore<boolean>("showAllStrings");
