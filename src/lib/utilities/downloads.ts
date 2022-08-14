import JSZip from "jszip";
import type { StringTableLocale as StblLocaleType } from "@s4tk/models/enums";
import type { StringTableResource as StblResourceType } from "@s4tk/models";
import type { ResourceKey, ResourceKeyPair } from "@s4tk/models/types";
import type { FileDownloadInfo } from "../../global";
import type Project from "../models/project";
import DownloadMethod from "../enums/downloads";
import NamingConvention from "../../typescript/enums/naming-convention";
import Settings from "../services/settings";
import DownloadOption, { LOCALE_OFFSET } from "../../typescript/enums/download-options";

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
    const downloadInfos: {
      project: Project,
      infos: FileDownloadInfo[]
    }[] = [];

    for (let i = 0; i < projects.length; ++i) {
      const project = projects[i];

      const downloadInfosToAdd = await getDownloadInfosForProject(
        project,
        method,
        getStblLocales(project, localesOption)
      );

      downloadInfos.push({
        project,
        infos: downloadInfosToAdd
      });
    }

    const zipName = projects.length === 1
      ? projects[0].metaData.name
      : "StblStudioProjects";

    resolve(
      (downloadInfos.length === 1) && (downloadInfos[0].infos.length === 1)
        ? downloadInfos[0].infos[0]
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
      .filter(locale => project.stbl.hasLocale(locale))
      .map(locale => {
        return {
          key: getKeyForLocale(project, locale),
          value: project.stbl.getStringTable(locale)
        };
      });

    if (method === DownloadMethod.Package) {
      const pkg = new Package(entries);
      const buffer = pkg.getBuffer();

      resolve([{
        filename: alphanumeric(project.metaData.name) + ".package",
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
          filename: getFilenameForLocale(locales[i], entry.key, project.metaData.name) + ext,
          data: new Blob([buffer])
        }
      });

      resolve(downloadInfos);
    }
  });
}

async function combineDownloadInfos(
  projectInfos: {
    project: Project,
    infos: FileDownloadInfo[]
  }[],
  zipName: string
): Promise<FileDownloadInfo> {
  return new Promise(async (resolve) => {
    const zip = new JSZip();

    if (projectInfos.length === 1) {
      projectInfos[0].infos.forEach(info => {
        zip.file(info.filename, info.data);
      });
    } else {
      projectInfos.forEach(({ project, infos }) => {
        const projectFolder = zip.folder(alphanumeric(project.metaData.name));
        infos.forEach(info => {
          projectFolder.file(info.filename, info.data);
        });
      });
    }

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
      return project.stbl.allLocales;
    case DownloadOption.PrimaryLocale:
      return [project.stbl.primaryLocale];
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
    group: project.metaData.group,
    instance: StringTableLocale.setHighByte(locale, project.metaData.instance)
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
      return `${alphanumeric(projectName)}_${localeName}`;
  }
}

function alphanumeric(string: string): string {
  return string.replace(/\W/g, '');
}

//#endregion Helpers
