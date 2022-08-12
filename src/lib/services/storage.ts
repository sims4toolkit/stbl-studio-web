import type LocalizedStringTable from "../models/localized-stbl";
import type Project from "../models/project";

enum Prefix {
  MetaData = "p",
  Setting = "s",
  Stbl = "m"
}

const getKey = (prefix: string, id: string) => `${prefix}:${id}`;

namespace StorageService {
  //#region Helpers

  // NOTE: Intentionally being exported so that they can be swapped out for
  // testing purposes (to write to an object instead of local storage)

  export function _readItem(key: string) {
    return localStorage.getItem(key);
  }

  export function _writeItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  //#endregion Helpers

  //#region Public Functions

  export function readMetaData(uuid: string): string {
    return _readItem(getKey(Prefix.MetaData, uuid));
  }

  export function writeMetaData(uuid: string, project: Project) {
    const key = getKey(Prefix.MetaData, uuid);
    _writeItem(key, project.serializeMetaData());
  }

  export function readStringTable(uuid: string): string {
    return _readItem(getKey(Prefix.Stbl, uuid));
  }

  export function writeStringTable(uuid: string, stbl: LocalizedStringTable) {
    const key = getKey(Prefix.Stbl, uuid);
    _writeItem(key, stbl.serialize());
  }

  export function readSetting(name: string): string | undefined {
    return _readItem(getKey(Prefix.Setting, name));
  }

  export function writeSetting(name: string, value: string) {
    const key = getKey(Prefix.Setting, name);
    _writeItem(key, value);
  }

  //#endregion Public Functions
}

export default StorageService;
