import { Writable, writable } from "svelte/store";
import type Workspace from "./models/workspace";
import { Settings } from "./storage";

export const activeWorkspace: Writable<Workspace> =
  writable(null);

export const isLightThemeStore: Writable<boolean> =
  writable(Settings.isLightTheme);

isLightThemeStore.subscribe(isLightTheme => {
  Settings.isLightTheme = isLightTheme;

  document.documentElement.setAttribute(
    "data-theme",
    isLightTheme ? "light" : "dark"
  );
});
