import type { StringTableResource as StblType, Package as PackageType } from "@s4tk/models";
import type { StringTableLocale as StblLocaleType } from "@s4tk/models/enums";
import type { ResourceKey, ResourceKeyPair } from "@s4tk/models/types";
import Project from "../models/project";

const { BinaryResourceType, StringTableLocale } = window.S4TK.enums;
const { Package, StringTableResource } = window.S4TK.models;
const { Buffer } = window.S4TK.Node;

//#region Types

interface FileError {
  filename: string;
  reason: string;
}

interface ParsedFilesResult {
  errors: FileError[];
  stbls: ResourceKeyPair<StblType>[];
}

//#endregion Types

//#region Exported Functions

// TODO:

//#endregion Exported Functions

//#region Helpers

async function parseFiles(files: FileList): Promise<ParsedFilesResult> {
  return new Promise(async (resolve, reject) => {
    const errors: FileError[] = [];
    const stbls: ResourceKeyPair<StblType>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const parsed = parseFile(file.name, buffer);
        stbls.push(...parsed);
      } catch (err) {
        errors.push({
          filename: file.name,
          reason: err
        });
      }
    }

    resolve({ errors, stbls });
  });
}

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

function parseStblJson(buffer: Buffer): StblType {
  const json: { key: string | number; value: string }[] = JSON.parse(buffer.toString());
  return new StringTableResource(json.map(({ key, value }) => {
    return {
      key: typeof key === "number" ? key : parseInt(key, 16),
      value
    };
  }));
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
    return {
      type: BinaryResourceType.StringTable,
      group: 0,
      instance: 0n,
    };
  }
}

//#endregion Helpers
