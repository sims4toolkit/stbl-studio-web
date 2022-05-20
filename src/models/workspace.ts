import type { StoredProject, StoredWorkspace } from "../global";
import StorageService from "../services/storage";
import Project from "./project";

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
  static async restore(json: StoredWorkspace): Promise<Workspace> {
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
        reject("Could not restore workspace.")
      }
    });
  }

  //#region Methods

  /**
   * Writes this workspace into a JSON that can be written.
   */
  toJson(): StoredWorkspace {
    const projects: { [key: string]: StoredProject } = {};

    this.projects.forEach(project => {
      projects[project.uuid] = StorageService.writeProjectData(project);
    });

    return {
      version: CURRENT_VERSION,
      settings: {
        creatorName: StorageService.settings.creatorName,
        defaultLocale: StorageService.settings.defaultLocale,
        isDarkTheme: StorageService.settings.isDarkTheme,
        projectUuids: StorageService.settings.projectUuids,
      },
      projects
    };
  }

  //#endregion Methods
}
