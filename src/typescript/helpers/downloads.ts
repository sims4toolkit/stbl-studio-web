import JSZip from "jszip";
import type { StringTableLocale as StblLocaleType } from "@s4tk/models/enums";
import type { StringTableResource as StblResourceType } from "@s4tk/models";
import type { ResourceKey, ResourceKeyPair } from "@s4tk/models/types";
import type { FileDownloadInfo } from "../../global";
import type Project from "../models/project";
import DownloadMethod from "../enums/download-method";
import NamingConvention from "../enums/naming-convention";
import { Settings } from "../storage";
import DownloadOption, { LOCALE_OFFSET } from "../enums/download-options";

const { Package } = window.S4TK.models;
const { StringTableLocale, BinaryResourceType } = window.S4TK.enums;
const { formatResourceKey } = window.S4TK.formatting;

/**
 * Get the download info for the provided projects and options.
 * 
 * @param projects List of projects to get download info for
 * @param method Download method to use
 * @param localesOption Which locale(s) to download
 */
export async function getDownloadInfoForProjects(
  projects: Project[],
  method: DownloadMethod,
  localesOption: DownloadOption
): Promise<FileDownloadInfo> {
  return new Promise(async (resolve) => {
    const downloadInfos: FileDownloadInfo[] = [];

    for (let i = 0; i < projects.length; ++i) {
      const project = projects[i];

      const downloadInfosToAdd = await getDownloadInfosForProject(
        project,
        method,
        getStblLocales(project, localesOption)
      );

      downloadInfos.push(...downloadInfosToAdd)
    }

    const zipName = projects.length === 1
      ? projects[0].name
      : "StblStudioProjects";

    resolve(
      downloadInfos.length === 1
        ? downloadInfos[0]
        : await combineDownloadInfos(downloadInfos, zipName)
    );
  });
}

//#region Helpers

async function getDownloadInfosForProject(
  project: Project,
  method: DownloadMethod,
  locales: StblLocaleType[]
): Promise<FileDownloadInfo[]> {
  return new Promise(async (resolve) => {
    const entries: ResourceKeyPair<StblResourceType>[] = locales
      .filter(locale => project.stblMap.has(locale))
      .map(locale => {
        return {
          key: getKeyForLocale(project, locale),
          value: project.stblMap.get(locale)
        };
      });

    if (method === DownloadMethod.Package) {
      const pkg = new Package(entries);
      const buffer = pkg.getBuffer();

      resolve([{
        filename: alphanumeric(project.name) + ".package",
        data: new Blob([buffer])
      }]);
    } else {
      const downloadInfos: FileDownloadInfo[] = entries.map((entry, i) => {
        const buffer = method === DownloadMethod.StringTables
          ? entry.value.getBuffer()
          : JSON.stringify(entry.value.toJsonObject(true, false), null, 2);

        const ext = method === DownloadMethod.StringTables
          ? ".stbl"
          : ".json";

        return {
          filename: getFilenameForLocale(locales[i], entry.key, project.name) + ext,
          data: new Blob([buffer])
        }
      });

      resolve(downloadInfos);
    }
  });
}

async function combineDownloadInfos(
  infos: FileDownloadInfo[],
  zipName: string
): Promise<FileDownloadInfo> {
  return new Promise(async (resolve) => {
    const zip = new JSZip();

    infos.forEach(info => {
      zip.file(info.filename, info.data);
    });

    resolve({
      filename: zipName + ".zip",
      data: await zip.generateAsync({ type: "blob" })
    });
  });
}

function getStblLocales(
  project: Project,
  localesOption: DownloadOption
): StblLocaleType[] {
  switch (localesOption) {
    case DownloadOption.AllLocales:
      return project.allLocales;
    case DownloadOption.PrimaryLocale:
      return [project.primaryLocale];
    default:
      return [localesOption - LOCALE_OFFSET] as StblLocaleType[];
  }
}

function getKeyForLocale(
  project: Project,
  locale: StblLocaleType
): ResourceKey {
  return {
    type: BinaryResourceType.StringTable,
    group: project.group,
    instance: StringTableLocale.setHighByte(locale, project.instanceBase)
  };
}

function getFilenameForLocale(
  locale: StblLocaleType,
  key: ResourceKey,
  projectName: string
): string {
  const localeName = StringTableLocale[locale];
  switch (Settings.namingConvention) {
    case NamingConvention.S4S:
      return formatResourceKey(key, "!") + `.${localeName}`;
    case NamingConvention.S4PI:
      return "S4_" + formatResourceKey(key, "_") + `.${localeName}`;
    case NamingConvention.NameOnly:
      return `${projectName.replace(/\W/g, '')}_${localeName}`;
  }
}

function alphanumeric(string: string): string {
  return string.replace(/\W/g, '');
}

//#endregion Helpers
