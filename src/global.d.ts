/// <reference types="svelte" />

import type { StringTableLocale } from "@s4tk/models/enums";

interface Selectable {
  selected?: boolean;
}

interface Stbl {
  entries: StblEntry[];
  locale: StringTableLocale;
}

interface StblEntry extends Selectable {
  isUpdated?: boolean;
  key: string;
  value: string;
}

interface StblProject extends Selectable {
  group: string;
  id: string;
  instance: string;
  name: string;
  primaryLocale: StringTableLocale;
  stbls: Stbl[];

  toJson(): string;
}

interface Workspace {
  version: number;
  projects: StblProject[];
  settings: WorkspaceSettings;

  toJson(): string;
}

interface WorkspaceSettings {
  creatorName: string;
  defaultLocale: StringTableLocale;
  isDarkTheme: boolean;
  nextProjectId: number;
}
