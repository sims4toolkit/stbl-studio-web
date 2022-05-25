import { Writable, writable } from "svelte/store";
import type Workspace from "./models/workspace";
import { Settings } from "./storage";

export const activeWorkspace: Writable<Workspace> = writable(null);

function createSettingStore<T>(
  name: string,
  onChange?: (value: T) => void
): Writable<boolean> {
  const store = writable(Settings[name]);

  store.subscribe(value => {
    Settings[name] = value;
    onChange?.(value);
  });

  return store;
}

export const isLightThemeStore = createSettingStore<boolean>(
  "isLightTheme",
  (value) => {
    document.documentElement.setAttribute(
      "data-theme",
      value ? "light" : "dark"
    );
  }
);

export const disableBlurStore = createSettingStore<boolean>(
  "disableBlur",
  (value) => {
    document.documentElement.setAttribute(
      "data-allow-blur",
      value ? "false" : "true"
    );
  }
);

export const reduceMotionStore = createSettingStore<boolean>("reduceMotion");
