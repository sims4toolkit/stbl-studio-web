import type { StringTableResource } from "@s4tk/models";
import type { ResourceKey } from "@s4tk/models/types";
import Settings from "src/lib/services/settings";
import { normalizeJson } from "./json";
const { enums, models } = window.S4TK;

//#region Types

interface ParsedFilesError {
  filename: string;
  message: string;
}

interface ParsedStringTable {
  key: ResourceKey;
  stbl: StringTableJson;
}

interface ParsedFilesResult {
  errors: ParsedFilesError[];
  stbls: ParsedStringTable[];
}

//#endregion Types

//#region Exports

/**
 * Parses and returns string tables from the files in the given FileList.
 * 
 * @param files FileList to extract stbls from
 */
export async function parseFiles(files: FileList): Promise<ParsedFilesResult> {
  return new Promise(async (resolve, reject) => {
    const result: ParsedFilesResult = {
      errors: [],
      stbls: []
    };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const parsed = parseFile(file.name, buffer);
        if (parsed.length) {
          result.stbls.push(...parsed);
        } else {
          throw new Error("No string tables found.");
        }
      } catch (err) {
        console.error(`Error while reading "${file.name}"\n${err}`);
        result.errors.push({
          filename: file.name,
          message: err
        });
      }
    }

    resolve(result);
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

    return [{ key, stbl }];
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
    .map(entry => ({
      key: entry.key,
      stbl: entry.value.toJsonObject(false, false)
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
