import MockStorage from "../../helpers/mock-storage.js";
import StorageService from "../../lib/services/storage.js";
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

  const sbtlString = newStbl().serialize();

  const newProject = () => new Project(uuid, newMetaData());

  const metaDataString = newProject().serializeMetaData();

  beforeEach(() => {
    MockStorage.clear();
  });

  //#endregion Helpers

  //#region Properties

  // uuid & meta data tested as part of constructor & deserialize()

  describe("#stbl", () => {
    it("should lazy load once accessed", () => {
      StorageService.writeStringTable(uuid, newStbl());
      const project = newProject();
      expect(project._stbl).to.be.undefined;
      expect(project.stbl).to.not.be.undefined;
      expect(project._stbl).to.not.be.undefined;
    });
  });

  //#endregion Properties

  //#region Initialization

  describe("#constructor", () => {
    // TODO:
  });

  describe("static#deserialize()", () => {
    // TODO:
  });

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

  describe("#fromStorage()", () => {
    // TODO:
  });

  //#endregion Initialization

  //#region Methods

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
