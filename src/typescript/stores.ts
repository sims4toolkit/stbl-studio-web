import { Writable, writable } from "svelte/store";
import type Workspace from "./models/workspace";
import StorageService from "./storage-service";

export const activeWorkspace: Writable<Workspace> = writable(null);

export const isLightThemeStore: Writable<boolean> =
  writable(StorageService.settings.isLightTheme);

isLightThemeStore.subscribe(isLightTheme => {
  StorageService.settings.isLightTheme = isLightTheme;

  document.documentElement.setAttribute(
    "data-theme",
    isLightTheme ? "light" : "dark"
  );
});
