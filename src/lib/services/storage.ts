import type LocalizedStringTable from "../models/localized-stbl.js";
import type Project from "../models/project.js";

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

  export const _storageInterface = {
    clear() {
      localStorage.clear();
    },
    delete(key: string) {
      localStorage.removeItem(key);
    },
    read(key: string) {
      return localStorage.getItem(key);
    },
    write(key: string, value: string) {
      localStorage.setItem(key, value);
    },
  };

  //#endregion Helpers

  //#region Public Functions

  export function readMetaData(uuid: string): string {
    return _storageInterface.read(getKey(Prefix.MetaData, uuid));
  }

  export function writeMetaData(project: Project) {
    const key = getKey(Prefix.MetaData, project.uuid);
    _storageInterface.write(key, project.serializeMetaData());
  }

  export function readStringTable(uuid: string): string {
    return _storageInterface.read(getKey(Prefix.Stbl, uuid));
  }

  export function writeStringTable(uuid: string, stbl: LocalizedStringTable) {
    const key = getKey(Prefix.Stbl, uuid);
    _storageInterface.write(key, stbl.serialize());
  }

  export function deleteProject(uuid: string) {
    _storageInterface.delete(getKey(Prefix.MetaData, uuid));
    _storageInterface.delete(getKey(Prefix.Stbl, uuid));
  }

  export function readSetting(name: string): string | undefined {
    return _storageInterface.read(getKey(Prefix.Setting, name));
  }

  export function writeSetting(name: string, value: string) {
    const key = getKey(Prefix.Setting, name);
    _storageInterface.write(key, value);
  }

  export function clear() {
    _storageInterface.clear();
  }

  //#endregion Public Functions
}

export default StorageService;
