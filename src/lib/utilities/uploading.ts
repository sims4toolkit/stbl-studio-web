import type { StringTableResource } from "@s4tk/models";
import type { StringTableLocale } from "@s4tk/models/enums";
import type { ResourceKey } from "@s4tk/models/types";
import LocalizedStringTable, { LocalizedStringEntry } from "src/lib/models/localized-stbl";
import Settings from "src/lib/services/settings";
import { normalizeJson } from "./json";
const { enums, models } = window.S4TK;
const { Buffer } = window.S4TK.Node;

//#region Types

interface ParsedFilesError {
  filename: string;
  message: string;
}

interface ParsedStringTable {
  locale: StringTableLocale;
  instanceBase: bigint;
  stbl: StringTableJson<number>;
}

export interface ParsedFilesResult {
  errors: ParsedFilesError[];
  stbls: ParsedStringTable[];
  instances: Set<bigint>;
  locales: Set<StringTableLocale>;
}

//#endregion Types

//#region Exports

/**
 * Parses and returns string tables from the files in the given FileList.
 * 
 * @param files FileList to extract stbls from
 */
export async function parseFiles(files: FileList): Promise<ParsedFilesResult> {
  return new Promise(async (resolve) => {
    const errors: ParsedFilesError[] = [];
    const stbls: ParsedStringTable[] = [];

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
          message: err
        });
      }
    }

    const instances = new Set<bigint>();
    const locales = new Set<StringTableLocale>();
    stbls.forEach(({ locale, instanceBase }) => {
      locales.add(locale);
      instances.add(instanceBase);
    });

    resolve({ errors, stbls, instances, locales });
  });
}

/**
 * Resolves the given string tables by combining ones that have the same locale
 * and ensuring that the primary locale has an entry for every key.
 * 
 * @param primaryLocale Primary locale of project
 * @param stbls String tables to resolve
 */
export async function resolveStringTables(
  primaryLocale: StringTableLocale,
  stbls: ParsedStringTable[]
): Promise<LocalizedStringTable> {
  return new Promise(async (resolve, reject) => {
    // mapping locales to their stbl instances
    const localeMap = new Map<StringTableLocale, ParsedStringTable[]>();

    stbls.forEach(stbl => {
      const arr = localeMap.get(stbl.locale) ?? [];
      if (!localeMap.has(stbl.locale)) localeMap.set(stbl.locale, arr);
      arr.push(stbl);
    });

    if (!localeMap.has(primaryLocale)) localeMap.set(primaryLocale, [
      {
        locale: primaryLocale,
        instanceBase: 0n, // not important, this info is in project
        stbl: []
      }
    ]);

    // finding all keys
    const primaryLocaleKeys = new Set<number>();
    const otherLocaleKeys = new Set<number>();
    const resolvedStbls: ParsedStringTable[] = [];
    localeMap.forEach((stblArr, locale) => {
      // mapping keys to all of their values
      const entries = new Map<number, Set<string>>();

      stblArr.forEach(({ stbl }) => {
        stbl.forEach(({ key, value }) => {
          if (!entries.get(key)?.has(value)) {
            const stringSet = entries.get(key) ?? new Set<string>();
            if (!entries.has(key)) entries.set(key, stringSet);
            stringSet.add(value);
          }

          if (locale === primaryLocale) {
            primaryLocaleKeys.add(key);
          } else {
            otherLocaleKeys.add(key);
          }
        });
      });

      const stblJson: StringTableJson<number> = [];
      entries.forEach((values, key) => {
        values.forEach(value => {
          stblJson.push({ key, value });
        });
      });

      resolvedStbls.push({
        locale,
        instanceBase: 0n, // not important, this info is in project
        stbl: stblJson
      });
    });

    // making sure primary stbl is filled out
    const primaryLocaleStbl = resolvedStbls
      .find(({ locale }) => locale === primaryLocale);

    otherLocaleKeys.forEach(key => {
      if (!primaryLocaleKeys.has(key))
        primaryLocaleStbl.stbl.push({ key, value: "" });
    });

    // localized entries to fill up
    const localizedEntries: Omit<LocalizedStringEntry, "id">[] = [];
    const keyIndices = new Map<number, number>();
    primaryLocaleStbl.stbl.forEach(({ key, value }, i) => {
      keyIndices.set(key, i);
      localizedEntries.push({
        key,
        values: new Map([[primaryLocale, value]])
      })
    });

    resolvedStbls.forEach(({ locale, stbl }) => {
      stbl.forEach(({ key, value }) => {
        if (!value) return;
        const index = keyIndices.get(key);
        const entry = localizedEntries[index];
        if (value === entry.values.get(primaryLocale)) return;
        entry.values.set(locale, value);
      });
    });

    const localizedStbl = new LocalizedStringTable(
      primaryLocale,
      new Set(localeMap.keys()),
      localizedEntries
    );

    resolve(localizedStbl);
  });
}

//#endregion Exports

//#region File Parsing

/**
 * Parses string tables from a single file.
 * 
 * @param filename Name of file to parse
 * @param buffer Buffer containing file data
 */
function parseFile(filename: string, buffer: Buffer): ParsedStringTable[] {
  const ext = getFileExtension(filename);

  if (ext === "package") {
    return parsePackage(buffer);
  } else {
    const key = getResourceKey(filename);

    const instanceBase = enums.StringTableLocale.getInstanceBase(key.instance);
    const locale = enums.StringTableLocale.getLocale(key.instance);
    if (!(locale in enums.StringTableLocale)) {
      key.instance = enums.StringTableLocale.setHighByte(
        Settings.defaultLocale,
        key.instance
      );
    }

    let stbl: StringTableJson;

    if (ext === "json") {
      stbl = normalizeJson(buffer);
    } else {
      // ext could be "binary", "stbl", or "bnry"
      stbl = models.StringTableResource
        .from(buffer)
        .toJsonObject(false, false);
    }

    return [{ locale, instanceBase, stbl: stbl as StringTableJson<number> }];
  }
}

/**
 * Parses all string tables in the given package and returns them as JSONs.
 * 
 * @param buffer Buffer containing Package data
 */
function parsePackage(buffer: Buffer): ParsedStringTable[] {
  return models.Package
    .extractResources<StringTableResource>(buffer, {
      resourceFilter: type => type === enums.BinaryResourceType.StringTable,
    })
    .map(({ key, value }) => ({
      locale: enums.StringTableLocale.getLocale(key.instance),
      instanceBase: enums.StringTableLocale.getInstanceBase(key.instance),
      stbl: value.toJsonObject(false, false) as StringTableJson<number>
    }));
}

//#endregion File Parsing

//#region Helpers

/**
 * Returns the last segment of a period-delimeted filename.
 * 
 * @param filename Filename to get extension of
 */
function getFileExtension(filename: string): string {
  // intentionally not using .at(-1) becase Safari doesn't support it yet
  const segments = filename.split(".");
  return segments[segments.length - 1];
}

/**
 * Returns the resource key in the given file name following either the S4S or
 * S4PI naming conventions.
 * 
 * @param filename Filename to get key from
 */
function getResourceKey(filename: string): ResourceKey {
  try {
    const { g, i } =
      /(?<t>[a-fA-F\d]{8})[_!]?(?<g>[a-fA-F\d]{8})[_!]?(?<i>[a-fA-F\d]{16})/.exec(
        filename
      ).groups;

    return {
      type: enums.BinaryResourceType.StringTable,
      group: parseInt(g, 16),
      instance: BigInt("0x" + i),
    };
  } catch (e) {
    const instance = enums.StringTableLocale.setHighByte(
      Settings.defaultLocale,
      0n
    );

    return {
      type: enums.BinaryResourceType.StringTable,
      group: 0x80000000,
      instance
    };
  }
}

//#endregion Helpers
