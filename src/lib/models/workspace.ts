import DatabaseService from "../services/database.js";
import Settings from "../services/settings.js";
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

  constructor(readonly projects: Project[] = []) {
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
   * Returns a JSON representation of this workspace.
   */
  toJson(): WorkspaceJson {
    return {
      version: Workspace.VERSION,
      settings: Settings,
      projects: this.projects.map(project => ({
        uuid: project.uuid,
        metaData: project.serializeMetaData(),
        stbl: project.stbl.serialize()
      }))
    };
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

  //#endregion Private Methods
}
