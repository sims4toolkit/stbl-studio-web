import MockStorage from "../../helpers/mock-storage.js";
import StorageService from "../../lib/services/storage.js";
import LocalizedStringTable from "../../lib/models/localized-stbl.js";
import Project from "../../lib/models/project.js";
const { expect } = chai;

describe("StorageService", () => {
  //#region Helpers

  const uuid = "12345";

  const newStbl = () => new LocalizedStringTable(0);

  const stblString = newStbl().serialize();

  const newProject = () =>
    new Project(uuid, {
      group: 0,
      instance: 12345n,
      name: "New Project",
      numEntries: 0,
      numLocales: 1,
      primaryLocale: 0,
    });

  const metaDataString = newProject().serializeMetaData();

  beforeEach(() => {
    MockStorage.clear();
  });

  //#endregion Helpers

  describe("#clear()", () => {
    it("should clear all entries in storage", () => {
      StorageService.writeSetting("setting", "1");
      StorageService.writeMetaData(newProject());
      StorageService.writeStringTable(uuid, newStbl());
      expect(MockStorage.count).to.equal(3);
      StorageService.clear();
      expect(MockStorage.count).to.equal(0);
    });
  });

  describe("#deleteProject()", () => {
    it("should delete the meta data and stbl for project with uuid", () => {
      StorageService.writeMetaData(newProject());
      StorageService.writeStringTable(uuid, newStbl());
      MockStorage.assert("p:12345", metaDataString);
      MockStorage.assert("m:12345", stblString);
      StorageService.deleteProject(uuid);
      MockStorage.assert("p:12345", undefined);
      MockStorage.assert("m:12345", undefined);
    });

    it("should not delete other projects", () => {
      StorageService.writeMetaData(newProject());
      StorageService.writeStringTable(uuid, newStbl());
      MockStorage.assert("p:12345", metaDataString);
      MockStorage.assert("m:12345", stblString);
      StorageService.deleteProject("54321");
      MockStorage.assert("p:12345", metaDataString);
      MockStorage.assert("m:12345", stblString);
    });
  });

  describe("#readMetaData()", () => {
    it("should return the meta data for the given uuid", () => {
      StorageService.writeMetaData(newProject());
      expect(StorageService.readMetaData(uuid)).to.equal(metaDataString);
    });
  });

  describe("#writeMetaData()", () => {
    it("should overwrite the project meta data that exists", () => {
      const project = newProject();
      StorageService.writeMetaData(project);
      MockStorage.assert("p:12345", metaDataString);
      project.metaData.group = 0x80000000;
      const newMetaData = project.serializeMetaData();
      expect(metaDataString).to.not.equal(newMetaData);
      StorageService.writeMetaData(project);
      MockStorage.assert("p:12345", newMetaData);
    });

    it("should add meta data if the project doesn't exist yet", () => {
      expect(MockStorage.count).to.equal(0);
      MockStorage.assert("p:12345", undefined);
      StorageService.writeMetaData(newProject());
      expect(MockStorage.count).to.equal(1);
      MockStorage.assert("p:12345", metaDataString);
    });
  });

  describe("#readStringTable()", () => {
    it("should return the stbl data for the given uuid", () => {
      StorageService.writeStringTable(uuid, newStbl());
      expect(StorageService.readStringTable(uuid)).to.equal(stblString);
    });
  });

  describe("#writeStringTable()", () => {
    it("should overwrite the stbl data that exists", () => {
      const stbl = newStbl();
      StorageService.writeStringTable(uuid, stbl);
      MockStorage.assert("m:12345", stblString);
      stbl.addEntry(0x1234, "hi");
      const newStblString = stbl.serialize();
      expect(metaDataString).to.not.equal(newStblString);
      StorageService.writeStringTable(uuid, stbl);
      MockStorage.assert("m:12345", newStblString);
    });

    it("should add stbl data if the project doesn't exist yet", () => {
      expect(MockStorage.count).to.equal(0);
      MockStorage.assert("m:12345", undefined);
      StorageService.writeStringTable(uuid, newStbl());
      expect(MockStorage.count).to.equal(1);
      MockStorage.assert("m:12345", stblString);
    });
  });

  describe("#readSetting()", () => {
    it("should return undefined if key doesn't exist", () => {
      expect(MockStorage.count).to.equal(0);
      MockStorage.assert("s:something", undefined);
    });

    it("should return the string value if the key exists", () => {
      StorageService.writeSetting("something", "first");
      expect(MockStorage.count).to.equal(1);
      MockStorage.assert("s:something", "first");
    });
  });

  describe("#writeSetting()", () => {
    it("should add a value for a key that doesn't exist", () => {
      expect(MockStorage.count).to.equal(0);
      StorageService.writeSetting("something", "some value");
      expect(MockStorage.count).to.equal(1);
      MockStorage.assert("s:something", "some value");
    });

    it("should set the value for a key that already exists", () => {
      StorageService.writeSetting("something", "first");
      expect(MockStorage.count).to.equal(1);
      StorageService.writeSetting("something", "second");
      expect(MockStorage.count).to.equal(1);
      MockStorage.assert("s:something", "second");
    });
  });
});
