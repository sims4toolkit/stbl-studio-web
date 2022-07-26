/// <reference types="svelte" />

import type { CompressionType, compressBuffer, decompressBuffer } from "@s4tk/compression";
import type { BinaryEncoder, BinaryDecoder } from "@s4tk/encoding";
import type { fnv32, fnv64 } from "@s4tk/hashing";
import type { formatAsHexString, formatResourceKey, formatStringKey, formatResourceInstance } from "@s4tk/hashing/formatting";
import type { Package, StringTableResource } from "@s4tk/models";
import type { StringTableLocale, BinaryResourceType } from "@s4tk/models/enums";
import type StringEntry from "@s4tk/models/lib/resources/stbl/string-entry";
import type DownloadMethod from "./typescript/enums/download-method";
import type DownloadOption from "./typescript/enums/download-options";
import type NamingConvention from "./typescript/enums/naming-convention";
import type ProjectView from "./typescript/enums/project-view";

type StblMap = Map<StringTableLocale, StringTableResource>;

interface FileError {
  filename: string;
  reason: string;
}

interface StringFilterTerm {
  type: number;
  text: string;
}

interface FileDownloadInfo {
  filename: string;
  data: Blob;
}

interface ParsedFilesResult {
  errors: FileError[];
  stbls: ResourceKeyPair<StblType>[];
}

interface DefaultProjectMetaData {
  primaryLocale: StblLocaleType;
  group: number;
  otherLocaleOptions: LocaleOption[];
  existingInstances: Set<bigint>;
}

interface LocaleStblPair {
  locale: StblLocaleType;
  stbl: StblType;
}

interface LocaleData {
  enumName: string;
  enumValue: number;
  englishName: string;
  country: string;
  nativeName: string;
  code: string;
}

interface LocaleOption {
  data: LocaleData;
  checked: boolean;
}

interface FloatingActionButtonData {
  color: string;
  title: string;
  icon: string;
  disabled?: boolean;
  disabledTitle?: string;
  keybinding?: string;
  onClick(): void;
}

interface ProjectMetaData {
  group: number;
  instanceBase: bigint;
  name: string;
  numLocales: number;
  numStrings: number;
  primaryLocale: StringTableLocale;
  translatingTo: StringTableLocale;
  readonly uuid: string;
  view: ProjectView;
}

interface UserSettings {
  defaultLocale: StringTableLocale;
  downloadMethod: DownloadMethod;
  downloadOption: DownloadOption;
  entriesPerPage: number;
  hasWorkspace: boolean;
  disableBlur: boolean;
  isLightTheme: boolean;
  namingConvention: NamingConvention;
  projectUuids: string[]
  reduceMotion: boolean;
  showAllStrings: boolean;
  showTranslateKeys: boolean;
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
