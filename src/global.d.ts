/// <reference types="svelte" />

import type { CompressionType, compressBuffer, decompressBuffer } from "@s4tk/compression";
import type { BinaryEncoder, BinaryDecoder } from "@s4tk/encoding";
import type { fnv64 } from "@s4tk/hashing";
import type { formatAsHexString, formatResourceKey, formatStringKey, formatResourceInstance } from "@s4tk/hashing/formatting";
import type { Package, StringTableResource } from "@s4tk/models";
import type { StringTableLocale, BinaryResourceType } from "@s4tk/models/enums";
import type ProjectView from "./typescript/enums/project-view";

type StblMap = Map<StringTableLocale, StringTableResource>;

interface UniqueStringEntry {
  id: number;
  key: number;
  value: string;
}

interface LocaleData {
  enumName: string;
  enumValue: number;
  englishName: string;
  country: string;
  nativeName: string;
  code: string;
}

interface ProjectMetaData {
  group: number;
  instanceBase: bigint;
  name: string;
  numLocales: number;
  numStrings: number;
  primaryLocale: StringTableLocale;
  readonly uuid: string;
  view: ProjectView;
}

interface UserSettings {
  defaultLocale: StringTableLocale;
  hasWorkspace: boolean;
  disableBlur: boolean;
  isLightTheme: boolean;
  projectUuids: string[]
  reduceMotion: boolean;
}

interface WorkspaceJson {
  version: number;

  settings: Omit<UserSettings, "hasWorkspace" | "projectUuids">;

  projects: {
    uuid: string;
    metaData: string;
    stblMap: string;
  }[];
}

declare global {
  interface Window {
    S4TK: {
      compression: {
        CompressionType: typeof CompressionType;
        compressBuffer: typeof compressBuffer;
        decompressBuffer: typeof decompressBuffer;
      },
      encoding: {
        BinaryEncoder: typeof BinaryEncoder;
        BinaryDecoder: typeof BinaryDecoder;
      },
      enums: {
        StringTableLocale: typeof StringTableLocale;
        BinaryResourceType: typeof BinaryResourceType;
      },
      formatting: {
        formatAsHexString: typeof formatAsHexString;
        formatResourceKey: typeof formatResourceKey;
        formatStringKey: typeof formatStringKey;
        formatResourceInstance: typeof formatResourceInstance;
      },
      hashing: {
        fnv64: typeof fnv64;
        fnv32: typeof fnv32;
      },
      models: {
        Package: typeof Package;
        StringTableResource: typeof StringTableResource;
      },
      Node: {
        Buffer: typeof Buffer;
      }
    };
  }
}

window.S4TK = window.S4TK || {};
