import DatabaseService from "../services/database.js";
import Settings from "../services/settings.js";
import { activeWorkspaceStore } from "../services/stores.js";
import LocalizedStringTable from "./localized-stbl.js";
import Project from "./project.js";

/**
 * How a workspace will be saved in a JSON.
 */
interface WorkspaceJson {
  version: number;
  settings: object;
  projects: {
    uuid: string;
    metaData: string;
    stbl: string;
  }[];
}

/**
 * Model for an entire user workspace.
 */
export default class Workspace {
  static readonly VERSION = 0;

  //#region Initialization

  constructor(public projects: Project[] = []) {
    this._sortProjects();
  }

  /**
   * Parses a workspace from the given JSON and overwrites the settings
   * currently in storage.
   * 
   * @param json JSON containing settings and workspace data
   */
  static async restoreFromJson(json: WorkspaceJson): Promise<Workspace> {
    return new Promise((resolve, reject) => {
      try {
        for (const setting in json.settings) {
          Settings[setting] = json.settings[setting];
        }

        const projects = json.projects.map(({ uuid, metaData, stbl }) => {
          DatabaseService.setItem("metadata", uuid, metaData);
          DatabaseService.setItem("stbls", uuid, stbl);

          return new Project(
            uuid,
            Project.deserializeMetaData(metaData),
            LocalizedStringTable.deserialize(stbl)
          );
        });

        const workspace = new Workspace(projects);

        resolve(workspace);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Reads the existing workspace from storage.
   */
  static async fromStorage(): Promise<Workspace> {
    return new Promise(async (resolve, reject) => {
      try {
        const uuids = await DatabaseService.getAllKeys("metadata");
        const metaDatas = await DatabaseService.getAll("metadata");

        const projects = uuids.map((uuid, i) => {
          return Project.deserialize(uuid, metaDatas[i]);
        });

        resolve(new Workspace(projects));
      } catch (err) {
        reject(err);
      }
    });
  }

  //#endregion Initialization

  //#region Public Methods

  /**
   * Adds a project to the workspace, saves it and its STBL to the DB, and
   * updates all subscribers to the workspace.
   * 
   * @param project Project to add
   */
  addProject(project: Project) {
    this.projects.push(project);
    project.saveToStorage();
    project.stbl.saveToStorage(project.uuid);
    this._updateSubscribers();
  }

  /**
   * Removes projects from the workspace, deletes them from storage, and
   * updates all subscribers to the workspace.
   * 
   * @param projects Projects to delete
   */
  deleteProjects(projects: Project[]) {
    const uuids = new Set(projects.map(p => p.uuid));
    this.projects = this.projects.filter(project => !uuids.has(project.uuid));

    uuids.forEach(uuid => {
      DatabaseService.removeItem("metadata", uuid);
      DatabaseService.removeItem("stbls", uuid);
    });

    this._updateSubscribers();
  }

  /**
   * Returns a JSON representation of this workspace.
   */
  async toJson(): Promise<WorkspaceJson> {
    return new Promise(async (resolve) => {
      for (let i = 0; i < this.projects.length; ++i)
        await this.projects[i].loadStringTable();

      const settings: object = {};
      for (const key in Settings) settings[key] = Settings[key];

      resolve({
        version: Workspace.VERSION,
        settings: settings,
        projects: this.projects.map(project => ({
          uuid: project.uuid,
          metaData: project.serializeMetaData(),
          stbl: project.stbl.serialize()
        }))
      });
    });
  }

  //#endregion Public Methods

  //#region Private Methods

  private _sortProjects() {
    this.projects.sort((p1, p2) => {
      const name1 = p1.metaData.name.toLowerCase();
      const name2 = p2.metaData.name.toLowerCase();
      if (name1 < name2) return -1;
      if (name1 > name2) return 1;
      return 0;
    });
  }

  private _updateSubscribers() {
    activeWorkspaceStore.set(this); // FIXME: is this right?
  }

  //#endregion Private Methods
}
