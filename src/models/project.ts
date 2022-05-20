import { StringTableResource } from "@s4tk/models";
import type { StringTableLocale } from "@s4tk/models/enums";
import type { ProjectData, StringTableWrapper } from "../global";
import StorageService from "../services/storage";

export default class Project implements ProjectData {
  group: number;
  instanceBase: bigint;
  name: string;
  primaryLocale: StringTableLocale;
  readonly stbls: StringTableWrapper[];
  readonly uuid: string;

  constructor(data: ProjectData) {
    this.group = data.group;
    this.instanceBase = data.instanceBase;
    this.name = data.name;
    this.primaryLocale = data.primaryLocale;
    this.stbls = data.stbls;
    this.uuid = data.uuid;
  }

  //#region Getters/Setters

  get allLocales(): StringTableLocale[] {
    return this.stbls.map(stbl => stbl.locale);
  }

  get primaryStbl(): StringTableWrapper {
    return this.getLocale(this.primaryLocale);
  }

  //#endregion Getters/Setters

  //#region Methods

  addLocale(locale: StringTableLocale) {
    this.stbls.push({
      locale,
      stbl: new StringTableResource(),
      updatedKeys: new Set()
    });
  }

  getLocale(locale: StringTableLocale): StringTableWrapper {
    return this.stbls.find(stbl => stbl.locale === locale);
  }

  save() {
    StorageService.saveProjectData(this);
  }

  //#endregion Methods
}
