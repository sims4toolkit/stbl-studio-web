/// <reference types="svelte" />

import type { StringTableResource } from "@s4tk/models";
import type { StringTableLocale } from "@s4tk/models/enums";

interface StringTableWrapper {
  locale: StringTableLocale;
  readonly stbl: StringTableResource;
  readonly updatedKeys?: Set<number>;
}

interface ProjectData {
  group: number;
  instanceBase: bigint;
  name: string;
  primaryLocale: StringTableLocale;
  readonly stbls: StringTableWrapper[];
  readonly uuid: string;
}

interface UserSettings {
  creatorName: string;
  defaultLocale: StringTableLocale;
  hasBeenOnboarded: boolean;
  isDarkTheme: boolean;
  projectUuids: string[]
}

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

interface StoredWorkspace {
  projects: { [key: string]: StoredProject; };
  settings: UserSettings;
  version: number;
}

declare global {
  interface Window {
    S4TK: {
      models: {
        Package: typeof Package;
        StringTableResource: typeof StringTableResource;
      },
      enums: {
        StringTableLocale: typeof StringTableLocale;
      }
    };
  }
}

window.S4TK = window.S4TK || {};
