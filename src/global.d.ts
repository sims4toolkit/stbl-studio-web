/// <reference types="svelte" />

import type { CompressionType, compressBuffer, decompressBuffer } from "@s4tk/compression";
import type { BinaryEncoder, BinaryDecoder } from "@s4tk/encoding";
import type { fnv64 } from "@s4tk/hashing";
import type { formatAsHexString } from "@s4tk/hashing/formatting";
import type { Package, StringTableResource } from "@s4tk/models";
import type { StringTableLocale, BinaryResourceType } from "@s4tk/models/enums";

interface LocaleData {
  enumName: string;
  enumValue: number;
  englishName: string;
  country: string;
  nativeName: string;
  code: string;
}

interface ProjectData {
  group: number;
  instanceBase: bigint;
  name: string;
  primaryLocale: StringTableLocale;
  readonly stblMap: Map<StringTableLocale, StringTableResource>;
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
  name: string;
  data: string; // Base64 DBPF containing all STBLs; First STBL is primary
}

interface StoredWorkspace {
  projects: { [key: string]: StoredProject; };
  settings: UserSettings;
  version: number;
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
