import MockStorage from "../../helpers/mock-storage.js";
import StorageService from "../../lib/services/storage.js";
const { expect } = chai;

describe("StorageService", () => {
  beforeEach(() => {
    MockStorage.clear();
  });

  describe("#readMetaData()", () => {
    // TODO:
  });

  describe("#writeMetaData()", () => {
    // TODO:
  });

  describe("#readStringTable()", () => {
    // TODO:
  });

  describe("#writeStringTable()", () => {
    // TODO:
  });

  describe("#readSetting()", () => {
    it("should return undefined if key doesn't exist", () => {
      expect(MockStorage.count).to.equal(0);
      MockStorage.assertSetting("something", undefined);
    });

    it("should return the string value if the key exists", () => {
      StorageService.writeSetting("something", "first");
      expect(MockStorage.count).to.equal(1);
      MockStorage.assertSetting("something", "first");
    });
  });

  describe("#writeSetting()", () => {
    it("should add a value for a key that doesn't exist", () => {
      expect(MockStorage.count).to.equal(0);
      StorageService.writeSetting("something", "some value");
      expect(MockStorage.count).to.equal(1);
      MockStorage.assertSetting("something", "some value");
    });

    it("should set the value for a key that already exists", () => {
      StorageService.writeSetting("something", "first");
      expect(MockStorage.count).to.equal(1);
      StorageService.writeSetting("something", "second");
      expect(MockStorage.count).to.equal(1);
      MockStorage.assertSetting("something", "second");
    });
  });
});
