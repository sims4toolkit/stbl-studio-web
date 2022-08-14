import MockStorage from "../../helpers/mock-storage.js";
import MockDatabase from "../../helpers/mock-db.js";
import DatabaseService from "../../lib/services/database.js";
import LocalizedStringTable from "../../lib/models/localized-stbl.js";
import Project from "../../lib/models/project.js";
import Workspace from "../../lib/models/workspace.js";
const { expect } = chai;
const { enums } = window.S4TK;

describe("Workspace", () => {
  //#region Helpers

  beforeEach(() => {
    MockStorage.clear();
    for (const store in MockDatabase) MockDatabase[store].clear();
  });

  const uuid = "12345";

  const newMetaData = () => ({
    group: 0x80000000,
    instance: 0x1234567890abcdn,
    name: "New Project",
    numEntries: 0,
    numLocales: 1,
    primaryLocale: 0,
  });

  const newStbl = () => new LocalizedStringTable(0);

  const stblString = newStbl().serialize();

  const newProject = () => new Project(uuid, newMetaData());

  const metaDataString = newProject().serializeMetaData();

  const newWorkspaceJson = () => ({
    version: 0,
    settings: {
      defaultLocale: 0,
      entriesPerPage: 5,
      hasWorkspace: true,
      disableBlur: false,
    },
    projects: [
      {
        uuid,
        metaData: metaDataString,
        stbl: stblString,
      },
    ],
  });

  //#endregion Helpers

  describe("static#restoreFromJson()", () => {
    it("should replace the settings in storage", async () => {
      expect(MockStorage.size).to.equal(0);

      await Workspace.restoreFromJson(newWorkspaceJson());

      expect(MockStorage.size).to.equal(4);
      expect(MockStorage.get("s:defaultLocale")).to.equal("0");
      expect(MockStorage.get("s:entriesPerPage")).to.equal("5");
      expect(MockStorage.get("s:hasWorkspace")).to.equal("true");
      expect(MockStorage.get("s:disableBlur")).to.equal("false");
    });

    it("should replace the projects in storage", async () => {
      expect(MockDatabase.metadata.size).to.equal(0);
      expect(MockDatabase.stbls.size).to.equal(0);

      await Workspace.restoreFromJson(newWorkspaceJson());

      expect(MockDatabase.metadata.size).to.equal(1);
      expect(MockDatabase.metadata.get(uuid)).to.equal(metaDataString);
      expect(MockDatabase.stbls.size).to.equal(1);
      expect(MockDatabase.stbls.get(uuid)).to.equal(stblString);
    });

    it("should return a workspace with all of the listed projects", async () => {
      const workspace = await Workspace.restoreFromJson(newWorkspaceJson());

      expect(workspace.projects).to.be.an("Array").with.lengthOf(1);
      const [project] = workspace.projects;
      expect(project.uuid).to.equal(uuid);

      const { metaData } = project;
      expect(metaData.group).to.equal(0x80000000);
      expect(metaData.instance).to.equal(0x1234567890abcdn);
      expect(metaData.name).to.equal("New Project");
      expect(metaData.numEntries).to.equal(0);
      expect(metaData.numLocales).to.equal(1);
      expect(metaData.primaryLocale).to.equal(enums.StringTableLocale.English);
    });
  });

  describe("static#fromStorage()", () => {
    it("should load all project meta data from storage", async () => {
      // TODO:
      expect(false).to.be.true;
    });

    it("should not load any stbls from storage", () => {
      // TODO:
      expect(false).to.be.true;
    });
  });

  describe("#toJson()", () => {
    it("should write all settings properly", () => {
      // TODO:
      expect(false).to.be.true;
    });

    it("should write all projects as base64 strings", () => {
      // TODO:
      expect(false).to.be.true;
    });
  });
});
