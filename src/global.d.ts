/// <reference types="svelte" />

import type { fnv64 } from "@s4tk/hashing";
import type { formatAsHexString } from "@s4tk/hashing/formatting";
import type { Package, StringTableResource } from "@s4tk/models";
import type { StringTableLocale, BinaryResourceType } from "@s4tk/models/enums";
import type { deflateSync, unzipSync } from "zlib";

interface LocaleData {
  enumName: string;
  enumValue: number;
  englishName: string;
  country: string;
  nativeName: string;
  code: string;
}

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
  hasWorkspace: boolean;
  isLightTheme: boolean;
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
        BinaryResourceType: typeof BinaryResourceType;
      },
      hashing: {
        fnv64: typeof fnv64
      },
      formatting: {
        formatAsHexString: typeof formatAsHexString
      },
      Node: {
        Buffer: typeof Buffer,
        deflateSync: typeof deflateSync,
        unzipSync: typeof unzipSync
      }
    };
  }
}

window.S4TK = window.S4TK || {};
