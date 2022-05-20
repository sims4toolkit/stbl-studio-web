/// <reference types="svelte" />

import type { StringTableLocale } from "@s4tk/models/enums";

interface StringTableWrapper {
  locale: StringTableLocale;
  readonly stbl: StringTableResource;
  readonly updatedKeys: Set<number>;
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
  isDarkTheme: boolean;
  projectUuids: string[]
}
