import Settings from "../services/settings";
import StorageService from "../services/storage";
import LocalizedStringTable from "./localized-stbl";
import Project from "./project";

/**
 * TODO:
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
 * TODO:
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
  static restoreFromJson(json: WorkspaceJson): Workspace {
    const projects = json.projects.map(projectData => {
      const metaData = Project.deserializeMetaData(projectData.metaData);
      const stbl = LocalizedStringTable.deserialize(projectData.stbl);
      return new Project(projectData.uuid, metaData, stbl);
    });

    return new Workspace(projects);
  }

  /**
   * Reads the existing workspace from storage.
   */
  static fromStorage(): Workspace {
    const projects = Settings.projectUuids.map(uuid => {
      const metaData = StorageService.readMetaData(uuid);
      return Project.deserialize(uuid, metaData)
    });

    return new Workspace(projects);
  }

  //#endregion Initialization

  //#region Public Methods

  /**
   * TODO:
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
