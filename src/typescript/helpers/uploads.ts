import type { StringTableResource as StblType } from "@s4tk/models";
import type { StringTableLocale as StblLocaleType } from "@s4tk/models/enums";
import type { ResourceKey, ResourceKeyPair } from "@s4tk/models/types";
import type { DefaultProjectMetaData, FileError, LocaleStblPair, ParsedFilesResult } from "../../global";
import { Settings } from "../storage";
import { parseStblJson } from "./json";
import { allLocales } from "./localization";

const { BinaryResourceType, StringTableLocale } = window.S4TK.enums;
const { Package, StringTableResource } = window.S4TK.models;
const { Buffer } = window.S4TK.Node;

//#region Exported Functions

/**
 * Reads the given files and extracts all of the STBLs that it can from them.
 * 
 * @param files Files to parse STBLs from
 */
export async function parseFiles(files: FileList): Promise<ParsedFilesResult> {
  return new Promise(async (resolve, reject) => {
    const errors: FileError[] = [];
    const stbls: ResourceKeyPair<StblType>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const parsed = parseFile(file.name, buffer);
        if (parsed.length) {
          stbls.push(...parsed);
        } else {
          throw new Error("No string tables found.");
        }
      } catch (err) {
        console.error(`Error while reading "${file.name}"\n${err}`);

        errors.push({
          filename: file.name,
          reason: err
        });
      }
    }

    resolve({ errors, stbls });
  });
}

/**
 * Determines the default meta data to use for a project containing the given
 * STBL resources.
 * 
 * @param resources List of STBL resources to get meta data for
 */
export function getDefaultMetaData(resources: ResourceKeyPair<StblType>[]): DefaultProjectMetaData {
  const includedLocales = new Set<StblLocaleType>();
  resources.forEach(({ key }) => {
    const locale = StringTableLocale.getLocale(key.instance);
    includedLocales.add(locale);
  });

  const primaryLocale = includedLocales.has(Settings.defaultLocale)
    ? Settings.defaultLocale
    : includedLocales[0];

  const { group, instance } = resources.find(({ key }) => {
    return StringTableLocale.getLocale(key.instance) === primaryLocale;
  }).key;

  const instanceBase = StringTableLocale.getInstanceBase(instance);

  const otherLocaleOptions = allLocales
    .filter((data) => data.enumValue !== primaryLocale)
    .map((data) => {
      return {
        data,
        checked: includedLocales.has(data.enumValue),
      };
    });

  return {
    primaryLocale,
    group,
    instanceBase,
    otherLocaleOptions
  };
}

/**
 * Merges all STBLs of the same locale, and prunes entries from secondary
 * locales if they are either not present in the primary STBL, or if their
 * value is exactly the same in the primary STBL.
 * 
 * WARNING: Might not behave as expected if any STBLs have repeated keys.
 * 
 * @param primaryLocale Primary locale of project
 * @param resources STBL resources to include in project
 */
export function mergeAndPruneLocales(primaryLocale: StblLocaleType, resources: ResourceKeyPair<StblType>[]): LocaleStblPair[] {
  const result: LocaleStblPair[] = [];

  // Index STBLs by locale
  const localeMap = new Map<StblLocaleType, StblType[]>();
  resources.forEach(({ key, value }) => {
    const locale = StringTableLocale.getLocale(key.instance);
    if (!localeMap.has(locale)) localeMap.set(locale, []);
    const localeStbls = localeMap.get(locale);
    localeStbls.push(value);
  });

  // Ensure only one STBL per locale
  let primaryStbl: StblType;
  localeMap.forEach((stbls, locale) => {
    let stbl: StblType;

    if (stbls.length === 1) {
      stbl = stbls[0];
    } else {
      const merged = new StringTableResource();

      stbls.forEach(stbl => {
        merged.addAll(stbl.entries);
      });

      stbl = merged;
    }

    if (locale === primaryLocale) primaryStbl = stbl;
    result.push({ locale, stbl });
  });

  // Remove entries from other locales if...
  // (1) They are not in the primary locale
  // (2) They are exactly the same in the primary locale
  result.forEach(({ locale, stbl }) => {
    // FIXME: include warning if there are any repeated keys, cause this can cause some issues...
    if (locale === primaryLocale) return;
    const keysToDelete: number[] = [];

    stbl.entries.forEach(({ key, value }) => {
      if (!primaryStbl.hasKey(key)) {
        keysToDelete.push(key);
      } else if (primaryStbl.getByKey(key).value === value) {
        keysToDelete.push(key)
      }
    });

    keysToDelete.forEach(key => {
      stbl.deleteByKey(key);
    });
  });

  return result;
}

//#endregion Exported Functions

//#region Helpers

function parseFile(filename: string, buffer: Buffer): ResourceKeyPair<StblType>[] {
  const ext = filename.split(".").at(-1);

  if (ext === "package") {
    return parsePackage(buffer);
  } else {
    const key = getResourceKey(filename);

    const value = ext === "json"
      ? parseStblJson(buffer)
      : parseStblBinary(buffer);

    return [{ key, value }];
  }
}

function parsePackage(buffer: Buffer): ResourceKeyPair<StblType>[] {
  return Package.extractResources<StblType>(buffer, {
    resourceFilter(type) {
      return type === BinaryResourceType.StringTable
    }
  });
}

function parseStblBinary(buffer: Buffer): StblType {
  return StringTableResource.from(buffer);
}

function getResourceKey(filename: string): ResourceKey {
  try {
    const { g, i } =
      /(?<t>[a-fA-F\d]{8})[_!]?(?<g>[a-fA-F\d]{8})[_!]?(?<i>[a-fA-F\d]{16})/.exec(
        filename
      ).groups;

    return {
      type: BinaryResourceType.StringTable,
      group: parseInt(g, 16),
      instance: BigInt("0x" + i),
    };
  } catch (e) {
    const instance = StringTableLocale.setHighByte(Settings.defaultLocale, 0n);

    return {
      type: BinaryResourceType.StringTable,
      group: 0,
      instance
    };
  }
}

//#endregion Helpers
