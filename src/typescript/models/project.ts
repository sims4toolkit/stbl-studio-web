import type { Package as PackageType, StringTableResource as StblType } from "@s4tk/models";
import type { StringTableLocale as StringTableLocaleType } from "@s4tk/models/enums";
import type { ProjectData } from "../../global";
import { v4 as uuidv4 } from "uuid";
import { getInstanceBase } from "../helpers/tgi";
import StorageService from "../storage-service";

const { Package, StringTableResource } = window.S4TK.models;
const { StringTableLocale, BinaryResourceType } = window.S4TK.enums;
const { fnv64 } = window.S4TK.hashing;

export default class Project implements ProjectData {
  group: number;
  instanceBase: bigint;
  name: string;
  primaryLocale: StringTableLocaleType;
  readonly pkg: PackageType;
  readonly uuid: string;

  constructor(
    data: Partial<ProjectData>,
    otherLocales: StringTableLocaleType[] = []
  ) {
    this.uuid = data.uuid ?? uuidv4();
    this.name = data.name ?? this.uuid;
    this.group = data.group ?? 0;
    this.instanceBase = data.instanceBase ?? getInstanceBase(fnv64(this.uuid));
    this.primaryLocale = data.primaryLocale ?? StorageService.settings.defaultLocale;
    this.pkg = data.pkg ?? new Package();

    if (this.pkg.size === 0) this.addLocale(this.primaryLocale);

    // TODO: don't create STBLs... have another structure that notes that the
    // locales are wanted, but don't actually create the STBLs for them until
    // at least one string is translated
    otherLocales.forEach(locale => {
      this.addLocale(locale);
    });
  }

  //#region Getters/Setters

  get allLocales(): StringTableLocaleType[] {
    return this.pkg.entries.map(entry => {
      return StringTableLocale.getLocale(entry.key.instance)
    });
  }

  get primaryStbl(): StblType {
    return this.getLocale(this.primaryLocale);
  }

  //#endregion Getters/Setters

  //#region Methods

  addLocale(locale: StringTableLocaleType) {
    this.pkg.add({
      type: BinaryResourceType.StringTable,
      group: this.group,
      instance: StringTableLocale.setHighByte(locale, this.instanceBase)
    }, new StringTableResource());
  }

  getLocale(locale: StringTableLocaleType): StblType {
    return this.pkg.entries.find(entry => {
      return StringTableLocale.getLocale(entry.key.instance) === locale;
    }).value as StblType;
  }

  save() {
    StorageService.saveProjectData(this);
  }

  //#endregion Methods
}
