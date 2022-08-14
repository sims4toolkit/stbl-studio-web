import MockStorage from "../../helpers/mock-storage.js";
import MockDatabase from "../../helpers/mock-db.js";
import StorageService from "../../lib/services/storage.js";
import DatabaseService from "../../lib/services/database.js";
import LocalizedStringTable from "../../lib/models/localized-stbl.js";
import Project from "../../lib/models/project.js";
const { expect } = chai;
const { enums } = window.S4TK;

describe("class Project", () => {
  //#region Helpers

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

  beforeEach(() => {
    MockStorage.clear();
    for (const store in MockDatabase) MockDatabase[store].clear();
  });

  //#endregion Helpers

  //#region Properties

  // uuid & meta data tested as part of constructor & deserialize()

  describe("#stbl", () => {
    it("should throw an exception if stbl not loaded", () => {
      const project = newProject();
      expect(project._stbl).to.be.undefined;
      expect(() => project.stbl).to.throw();
    });

    it("should lazy load the stbl from the DB", async () => {
      await DatabaseService.setItem("stbls", uuid, stblString);
      const project = newProject();
      expect(project._stbl).to.be.undefined;
      await project.loadStringTable();
      expect(project.stbl).to.not.be.undefined;
    });
  });

  //#endregion Properties

  //#region Initialization

  // nothing to test for constructor

  // nothing to test for deserialize(); only logic is in deserializeMetaData()

  describe("static#deserializeMetaData()", () => {
    context("version 0", () => {
      it("should deserialize correctly", () => {
        const metaData = Project.deserializeMetaData(
          "AAAAAIDNq5B4VjQSAAEAAAAATmV3IFByb2plY3QA"
        );

        expect(metaData.group).to.equal(0x80000000);
        expect(metaData.instance).to.equal(0x1234567890abcdn);
        expect(metaData.name).to.equal("New Project");
        expect(metaData.numEntries).to.equal(0);
        expect(metaData.numLocales).to.equal(1);
        expect(metaData.primaryLocale).to.equal(
          enums.StringTableLocale.English
        );
      });

      it("should deserialize correctly when locale ≠ English", () => {
        const metaData = Project.deserializeMetaData(
          "AAAAAIDNq5B4VjQSCwEAAAAATmV3IFByb2plY3QA"
        );

        expect(metaData.group).to.equal(0x80000000);
        expect(metaData.instance).to.equal(0x1234567890abcdn);
        expect(metaData.name).to.equal("New Project");
        expect(metaData.numEntries).to.equal(0);
        expect(metaData.numLocales).to.equal(1);
        expect(metaData.primaryLocale).to.equal(
          enums.StringTableLocale.Italian
        );
      });
    });
  });

  describe("static#fromStorage()", () => {
    context("meta data version 0", () => {
      it("should load the meta data from storage", async () => {
        await DatabaseService.setItem("metadata", uuid, metaDataString);
        await DatabaseService.setItem("stbls", uuid, stblString);

        const project = await Project.fromStorage(uuid);
        const metaData = project.metaData;

        expect(project.uuid).to.equal(uuid);
        expect(metaData.group).to.equal(0x80000000);
        expect(metaData.instance).to.equal(0x1234567890abcdn);
        expect(metaData.name).to.equal("New Project");
        expect(metaData.numEntries).to.equal(0);
        expect(metaData.numLocales).to.equal(1);
        expect(metaData.primaryLocale).to.equal(
          enums.StringTableLocale.English
        );
      });
    });
  });

  //#endregion Initialization

  //#region Methods

  describe("#loadStringTable()", () => {
    it("should load the stbl with the same uuid from storage", async () => {
      const stbl = newStbl();
      stbl.addEntry(0x12345678, "First");
      stbl.addEntry(0x87654321, "Second");
      stbl.replaceLocales([
        enums.StringTableLocale.English,
        enums.StringTableLocale.Italian,
      ]);

      await DatabaseService.setItem("stbls", uuid, stbl.serialize());

      const project = Project.deserialize(uuid, metaDataString);
      expect(() => project.stbl).to.throw();
      await project.loadStringTable();

      expect(project.stbl.primaryLocale).to.equal(
        enums.StringTableLocale.English
      );
      expect(project.stbl.allLocales).to.have.lengthOf(2);
      expect(project.stbl.numEntries).to.equal(2);
      expect(project.stbl.getValue(0)).to.equal("First");
      expect(project.stbl.getValue(1)).to.equal("Second");
    });
  });

  describe("#serializeMetaData()", () => {
    context("version 0", () => {
      it("should serialize correctly", () => {
        const project = newProject();
        expect(project.serializeMetaData()).to.equal(
          "AAAAAIDNq5B4VjQSAAEAAAAATmV3IFByb2plY3QA"
        );
      });

      it("should serialize with other locale correctly", () => {
        const project = newProject();
        project.metaData.primaryLocale = enums.StringTableLocale.Italian;
        expect(project.serializeMetaData()).to.equal(
          "AAAAAIDNq5B4VjQSCwEAAAAATmV3IFByb2plY3QA"
        );
      });
    });
  });

  //#endregion Methods
});
