import type { StringTableResource as StblType, Package as PackageType } from "@s4tk/models";
import type { StringTableLocale as StblLocaleType } from "@s4tk/models/enums";
import Project from "../models/project";

const { BinaryResourceType, StringTableLocale } = window.S4TK.enums;
const { Package, StringTableResource } = window.S4TK.models;
const { Buffer } = window.S4TK.Node;

interface UploadedStringTable {
  /** The locale. If undefined, it's unknown. */
  locale: StblLocaleType;

  /** The STBL. If undefined, this file failed. */
  stbl: StblType;
}

/**
 * TODO:
 * 
 * @param files TODO:
 */
export async function parseStblsFromFiles(
  files: FileList
): Promise<UploadedStringTable[]> {
  return new Promise(async (resolve, reject) => {
    // TODO:
  });
}

// function mergeAllSameLocales(uploaded: UploadedStringTable[]): 
