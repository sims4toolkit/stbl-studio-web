import type { ProjectData, StoredProject, StoredWorkspace } from "../../global";
import StorageService from "../storage-service";
import { activeWorkspace } from "../stores";
import Project from "./project";

const CURRENT_VERSION = 1;

export default class Workspace {
  constructor(readonly projects: Project[] = []) {
    this._sortProjects();
  }

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
    const project = new Project(data);
    this.projects.push(project);
    StorageService.saveProjectData(project);

    const projectUuids = StorageService.settings.projectUuids;
    projectUuids.push(project.uuid);
    StorageService.settings.projectUuids = projectUuids;

    this._sortProjects();
    activeWorkspace.set(this); // to update components
  }

  /**
   * Finds and returns a project from its UUID.
   * 
   * @param uuid UUID of project to get
   */
  getProject(uuid: string): Project {
    return this.projects.find(project => project.uuid === uuid);
  }

  /**
   * Removes projects from the workspace and deletes them from storage.
   * 
   * @param projects Projects to remove
   */
  removeProjects(...projects: Project[]) {
    projects.forEach(project => {
      const { uuid } = project;

      const projectIndex = this.projects.findIndex(project => {
        return uuid === project.uuid;
      });

      if (projectIndex != -1) {
        this.projects.splice(projectIndex, 1);
        StorageService.deleteProjectData(uuid);
      }
    });

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

  //#region Private Methods

  private _sortProjects() {
    this.projects.sort((p1, p2) => {
      const name1 = p1.name.toLowerCase();
      const name2 = p2.name.toLowerCase();
      if (name1 < name2) return -1;
      if (name1 > name2) return 1;
      return 0;
    });
  }

  //#endregion Private Methods
}
