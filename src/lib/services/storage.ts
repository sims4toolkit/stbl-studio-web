import type LocalizedStringTable from "../models/localized-stbl";
import type Project from "../models/project";

enum Prefix {
  MetaData = "p",
  Setting = "s",
  Stbl = "m"
}

const getKey = (prefix: string, id: string) => `${prefix}:${id}`;
const readItem = (key: string) => localStorage.getItem(key);
const writeItem = (key: string, value: string) => localStorage.setItem(key, value);

namespace StorageService {
  //#region Projects

  export function readMetaData(uuid: string) {
    return readItem(getKey(Prefix.MetaData, uuid));
  }

  export function writeMetaData(uuid: string, project: Project) {
    const key = getKey(Prefix.MetaData, uuid);
    writeItem(key, project.serializeMetaData());
  }

  export function readStringTable(uuid: string) {
    return readItem(getKey(Prefix.Stbl, uuid));
  }

  export function writeStringTable(uuid: string, stbl: LocalizedStringTable) {
    const key = getKey(Prefix.Stbl, uuid);
    writeItem(key, stbl.serialize());
  }

  export function readSetting(name: string): string | undefined {
    return readItem(getKey(Prefix.Setting, name));
  }

  export function writeSetting(name: string, value: string) {
    const key = getKey(Prefix.Setting, name);
    writeItem(key, value);
  }
}

export default StorageService;
