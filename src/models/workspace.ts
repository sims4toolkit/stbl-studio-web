import { v4 as uuidv4 } from "uuid";
import type { ProjectData, StoredProject, StoredWorkspace } from "../global";
import StorageService from "../services/storage";
import { activeWorkspace } from "../services/stores";
import Project from "./project";

const { StringTableResource } = window.S4TK.models;
const { StringTableLocale } = window.S4TK.enums;
const { fnv64 } = window.S4TK.hashing;

const CURRENT_VERSION = 1;

export default class Workspace {
  constructor(readonly projects: Project[] = []) { }

  /**
   * Restores a workspace from a JSON.
   * 
   * WARNING: This will clear localStorage and replace all values with thise
   * in the JSON.
   * 
   * @param json JSON that contains workspace data
   */
  static async restoreFromJson(json: StoredWorkspace): Promise<Workspace> {
    return new Promise(async (resolve, reject) => {
      try {
        const projects: Project[] = Object.entries(json.projects)
          .map(([uuid, stored]) => StorageService.readProjectData(uuid, stored))
          .map(projectData => new Project(projectData));

        localStorage.clear();

        StorageService.restoreSettings(json.settings);
        projects.forEach(StorageService.saveProjectData);

        resolve(new Workspace(projects));
      } catch (e) {
        console.error(e);
        reject("Could not restore workspace from JSON.")
      }
    });
  }

  /**
   * Restores a workspace from localStorage.
   */
  static async restoreFromStorage(): Promise<Workspace> {
    return new Promise(async (resolve, reject) => {
      try {
        const projects = StorageService.settings.projectUuids.map(uuid => {
          return new Project(StorageService.loadProjectData(uuid));
        });

        const workspace = new Workspace(projects);

        resolve(workspace);
      } catch (e) {
        console.error(e);
        reject("Could not restore workspace from storage.")
      }
    });
  }

  //#region Methods

  /**
   * Creates and adds a new project to this workspace.
   * 
   * @param data Object containing data for project
   */
  addProject(data: Partial<ProjectData> = {}) {
    const uuid = data.uuid ?? uuidv4();
    const primaryLocale = data.primaryLocale ?? StringTableLocale.English;
    const stbls = data.stbls ?? [];

    if (!stbls.find(stbl => stbl.locale === primaryLocale)) {
      stbls.push({
        locale: primaryLocale,
        stbl: new StringTableResource(),
      });
    }

    const project = new Project({
      uuid,
      name: data.name ?? "New Project",
      group: data.group ?? 0,
      instanceBase: data.instanceBase ?? fnv64(uuid) & 0xFFFFFFFFFFFFFFn,
      primaryLocale,
      stbls,
    });

    this.projects.push(project);

    StorageService.saveProjectData(project);
    const projectUuids = StorageService.settings.projectUuids;
    projectUuids.push(uuid);
    StorageService.settings.projectUuids = projectUuids;

    activeWorkspace.set(this); // to update components
  }

  /**
   * Writes this workspace into a JSON that can be written.
   */
  toBlob(): Blob {
    const projects: { [key: string]: StoredProject } = {};

    this.projects.forEach(project => {
      projects[project.uuid] = StorageService.writeProjectData(project);
    });

    const json = {
      version: CURRENT_VERSION,
      settings: {
        creatorName: StorageService.settings.creatorName,
        defaultLocale: StorageService.settings.defaultLocale,
        hasWorkspace: StorageService.settings.hasWorkspace,
        isLightTheme: StorageService.settings.isLightTheme,
        projectUuids: StorageService.settings.projectUuids,
      },
      projects
    };

    const content = JSON.stringify(json);

    return new Blob([content]);
  }

  //#endregion Methods
}
