import type { WorkspaceJson } from "../../global";
import { addProject, deleteProject, getWorkspaceJson, loadProjectMetaData, overwriteWorkspace, Settings } from "../storage";
import { activeWorkspace } from "../stores";
import Project from "./project";

/**
 * A workspace that contains projects.
 */
export default class Workspace {
  constructor(readonly projects: Project[] = []) {
    this._sortProjects();
  }

  /**
   * Restores a workspace from a JSON.
   * 
   * WARNING: This will clear localStorage and replace all values with those
   * in the JSON.
   * 
   * @param json JSON that contains workspace data
   */
  static async restoreFromJson(json: WorkspaceJson): Promise<Workspace> {
    return new Promise(async (resolve, reject) => {
      try {
        await overwriteWorkspace(json);

        Workspace.restoreFromStorage()
          .then(workspace => {
            resolve(workspace)
          });
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
        const projects = Settings.projectUuids.map(uuid => {
          const data = loadProjectMetaData(uuid);
          return new Project(data);
        });

        resolve(new Workspace(projects));
      } catch (e) {
        console.error(e);
        reject("Could not restore workspace from storage.")
      }
    });
  }

  //#region Methods

  /**
   * Adds a new project to this workspace and saves it to storage.
   * 
   * @param project Project to add
   */
  addProject(project: Project) {
    this.projects.push(project);
    this._sortProjects();
    addProject(project);
    this._updateComponents();
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
  deleteProjects(...projects: Project[]) {
    projects.forEach(({ uuid }) => {
      const projectIndex = this.projects.findIndex(project => {
        return uuid === project.uuid;
      });

      if (projectIndex !== -1) {
        this.projects.splice(projectIndex, 1);
        deleteProject(uuid);
      }
    });

    this._updateComponents();
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

  private _updateComponents() {
    activeWorkspace.set(this);
  }

  //#endregion Private Methods
}
