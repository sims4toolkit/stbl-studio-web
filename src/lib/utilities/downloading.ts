import JSZip from "jszip";
import type { StringTableLocale } from "@s4tk/models/enums";
import type { ResourceKey } from "@s4tk/models/types";
import type Project from "src/lib/models/project";
const { models, enums, formatting } = window.S4TK;

type FileDownloadType = "package" | "stbl" | "json";
type FileNamingConvention = "s4s" | "s4pi" | "project";

interface DownloadInfo {
  filename: string;
  data: Blob;
}

const GENERIC_DOWNLOAD_NAME = "StblStudioDownload";

/**
 * Generates a blob to download for the given projects.
 * 
 * @param projects List of projects to generate files for
 * @param locales Locales to include for each project
 * @param fileType Type of file(s) to generate
 * @param namingConvention Naming convention to use if STBL or JSON
 */
export async function generateBlobForProjects(
  projects: Project[],
  locales: StringTableLocale[],
  fileType: FileDownloadType,
  namingConvention: FileNamingConvention
): Promise<DownloadInfo> {
  return new Promise(async (resolve, reject) => {
    try {
      const downloadInfoGroups = projects.map(project =>
        getDownloadInfosForProject(
          project,
          locales,
          fileType,
          namingConvention
        ));

      if (downloadInfoGroups.length === 1) {
        // only one project
        const [projectDownloadInfos] = downloadInfoGroups;
        if (projectDownloadInfos.length === 1) {
          // only one file to download
          resolve(projectDownloadInfos[0]);
        } else {
          // multiple files need to be zipped together
          const zipName = alphanumeric(projects[0].metaData.name);
          resolve(await combineDownloadInfos(zipName, projectDownloadInfos));
        }
      } else {
        // >1 projects
        if (downloadInfoGroups[0].length === 1 && namingConvention === "project") {
          // each project has one package, don't use subfolders
          resolve(await combineDownloadInfos(
            GENERIC_DOWNLOAD_NAME,
            downloadInfoGroups.map(arr => arr[0])
          ));
        } else {
          // each project has multiple files OR the names are TGI, use subfolders
          resolve(await combineDownloadInfosWithSubfolders(
            GENERIC_DOWNLOAD_NAME,
            downloadInfoGroups,
            projects.map(p => alphanumeric(p.metaData.name))
          ));
        }
      }
    } catch (err) {
      reject(err);
    }
  });
}

//#region Download Info Generators

/**
 * Gets all files to download for the given project.
 * 
 * @param project Project to get download infos for
 * @param locales Locales to include in download
 * @param fileType How to download the project's STBL(s)
 * @param namingConvention Naming convention to use
 */
function getDownloadInfosForProject(
  project: Project,
  locales: StringTableLocale[],
  fileType: FileDownloadType,
  namingConvention: FileNamingConvention
): DownloadInfo[] {
  switch (fileType) {
    case "package":
      return [getPackageForProject(project, locales)];
    case "stbl":
      return getStringTablesForProject(project, locales, namingConvention);
    case "json":
      return getJsonsForProject(project, locales, namingConvention);
  }
}

/**
 * Gets a package for the given project.
 * 
 * @param project Project to get package for
 * @param locales Locales to include in package
 */
function getPackageForProject(
  project: Project,
  locales: StringTableLocale[]
): DownloadInfo {
  const pkg = new models.Package(locales.map(locale => {
    return {
      key: getKey(project, locale),
      value: project.stbl.getStringTable(locale)
    };
  }));

  return {
    filename: `${alphanumeric(project.metaData.name)}.package`,
    data: new Blob([pkg.getBuffer()])
  };
}

/**
 * Gets the STBLs for the given project.
 * 
 * @param project Project to get STBLs for
 * @param locales Locales of STBLs to get
 */
function getStringTablesForProject(
  project: Project,
  locales: StringTableLocale[],
  namingConvention: FileNamingConvention
): DownloadInfo[] {
  return locales.map(locale => {
    const stbl = project.stbl.getStringTable(locale);

    return {
      filename: getStblName(project, locale, "stbl", namingConvention),
      data: new Blob([stbl.getBuffer()])
    };
  });
}

/**
 * Gets the JSONs for the given project.
 * 
 * @param project Project to get JSONs for
 * @param locales Locales of JSONs to get
 */
function getJsonsForProject(
  project: Project,
  locales: StringTableLocale[],
  namingConvention: FileNamingConvention
): DownloadInfo[] {
  return locales.map(locale => {
    const json = project.stbl.getJson<string>(locale, true);
    const content = JSON.stringify(json, null, 2);

    return {
      filename: getStblName(project, locale, "json", namingConvention),
      data: new Blob([content])
    };
  });
}

//#endregion Download Info Generators

//#region Helpers

/**
 * ZIPs the download infos into one file.
 * 
 * @param zipName Name to use for ZIP file
 * @param infos Download infos to combine
 */
async function combineDownloadInfos(
  zipName: string,
  infos: DownloadInfo[]
): Promise<DownloadInfo> {
  return new Promise(async (resolve) => {
    const zip = new JSZip();

    infos.forEach(info => zip.file(info.filename, info.data));

    resolve({
      filename: zipName + ".zip",
      data: await zip.generateAsync({ type: "blob" })
    });
  });
}

/**
 * ZIPs the download infos into one file using subfolders.
 * 
 * @param zipName Name to use for ZIP file
 * @param infoArrays Download infos to combine
 * @param subfolders Array of subfolder names to use (order matches infos)
 */
async function combineDownloadInfosWithSubfolders(
  zipName: string,
  infoArrays: DownloadInfo[][],
  subfolders: string[]
): Promise<DownloadInfo> {
  return new Promise(async (resolve) => {
    const zip = new JSZip();

    infoArrays.forEach((infos, i) => {
      const folder = zip.folder(subfolders[i]);
      infos.forEach(info => {
        folder.file(info.filename, info.data);
      });
    });

    resolve({
      filename: zipName + ".zip",
      data: await zip.generateAsync({ type: "blob" })
    });
  });
}

/**
 * Gets the name to use for a loose STBL or JSON.
 * 
 * @param project Project that STBL is a part of
 * @param locale Locale of STBL
 * @param fileType Kind of file (only STBL or JSON expected)
 * @param namingConvention Naming convention to use
 */
function getStblName(
  project: Project,
  locale: StringTableLocale,
  fileType: FileDownloadType,
  namingConvention: FileNamingConvention
): string {
  let filename: string;

  if (namingConvention === "project") {
    filename = `${alphanumeric(project.metaData.name)}_${enums.StringTableLocale[locale]}`;
  } else {
    const key = getKey(project, locale);

    if (namingConvention === "s4s") {
      filename = `${formatting.formatResourceKey(key, "!")}.${enums.StringTableLocale[locale]}`;
    } else {
      filename = `S4_${formatting.formatResourceKey(key, "_")}`;
    }
  }

  return `${filename}.${fileType}`;
}

/**
 * Strips out all non-alphanumeric characters from the given string.
 * 
 * @param string String to reduce to alphanumeric characters
 */
function alphanumeric(string: string): string {
  return string.replace(/\W/g, "");
}

/**
 * Returns the key to use for a specific STBL.
 * 
 * @param project Project that STBL is a part of
 * @param locale Locale of STBL
 */
function getKey(project: Project, locale: StringTableLocale): ResourceKey {
  return {
    type: enums.BinaryResourceType.StringTable,
    group: project.metaData.group,
    instance: enums.StringTableLocale.setHighByte(
      locale,
      project.metaData.instance
    )
  };
}

//#endregion Helpers
