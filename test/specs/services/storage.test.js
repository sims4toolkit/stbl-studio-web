import MockStorage from "../../helpers/mock-storage.js";
import StorageService from "../../lib/services/storage.js";
const { expect } = chai;

describe("StorageService", () => {
  //#region Helpers

  beforeEach(() => {
    MockStorage.clear();
  });

  //#endregion Helpers

  describe("#clear()", () => {
    it("should clear all entries in storage", () => {
      StorageService.setItem("one", "1");
      StorageService.setItem("two", "2");
      expect(MockStorage.size).to.equal(2);
      StorageService.clear();
      expect(MockStorage.size).to.equal(0);
    });
  });

  describe("#getItem()", () => {
    it("should return undefined if the given key has no value", () => {
      MockStorage.set("one", "1");
      expect(StorageService.getItem("two")).to.be.undefined;
    });

    it("should return the value for the given key", () => {
      MockStorage.set("one", "1");
      expect(StorageService.getItem("one")).to.equal("1");
    });
  });

  describe("#removeItem()", () => {
    it("should delete the item with the given key", () => {
      MockStorage.set("one", "1");
      expect(MockStorage.size).to.equal(1);
      StorageService.removeItem("one");
      expect(MockStorage.size).to.equal(0);
    });
  });

  describe("#setItem()", () => {
    it("should set the item with the given key", () => {
      expect(MockStorage.size).to.equal(0);
      StorageService.setItem("key", "2");
      expect(MockStorage.size).to.equal(1);
      expect(MockStorage.get("key")).to.equal("2");
    });

    it("should replace the item with the given key", () => {
      MockStorage.set("key", "1");
      expect(MockStorage.size).to.equal(1);
      expect(MockStorage.get("key")).to.equal("1");
      StorageService.setItem("key", "2");
      expect(MockStorage.size).to.equal(1);
      expect(MockStorage.get("key")).to.equal("2");
    });
  });
});
