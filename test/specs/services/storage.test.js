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
    // TODO:
  });

  describe("#writeSetting()", () => {
    // TODO:

    it("should write a value for the given key", () => {
      expect(MockStorage.count).to.equal(0);
      StorageService.writeSetting("something", "some value");
      expect(MockStorage.count).to.equal(1);
      MockStorage.assertSetting("something", "some value");
    });
  });
});
