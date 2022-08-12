import MockStorage from "../../helpers/mock-storage.js";
import Settings from "../../lib/services/settings.js";
const { expect } = chai;

describe("Settings", () => {
  beforeEach(() => {
    MockStorage.clear();
  });

  describe("StoredBoolean", () => {
    it("should be false by default", () => {
      MockStorage.assert("s:disableBlur", undefined);
      expect(Settings.disableBlur).to.be.false;
    });

    it("should be true if string value is 'true'", () => {
      MockStorage.set("s:disableBlur", "true");
      expect(Settings.disableBlur).to.be.true;
    });

    it("should be false if string value is 'false'", () => {
      MockStorage.set("s:disableBlur", "false");
      expect(Settings.disableBlur).to.be.false;
    });

    it("should write 'true' if value is set to true", () => {
      MockStorage.assert("s:disableBlur", undefined);
      Settings.disableBlur = true;
      MockStorage.assert("s:disableBlur", "true");
    });

    it("should write 'false' if value is set to false", () => {
      MockStorage.assert("s:disableBlur", undefined);
      Settings.disableBlur = false;
      MockStorage.assert("s:disableBlur", "false");
    });
  });

  describe("StoredInteger", () => {
    it("should use default value if doesn't exist (0)", () => {
      MockStorage.assert("s:defaultLocale", undefined);
      expect(Settings.defaultLocale).to.equal(0);
    });

    it("should use default value if doesn't exist (12)", () => {
      MockStorage.assert("s:entriesPerPage", undefined);
      expect(Settings.entriesPerPage).to.equal(12);
    });

    it("should return number value parsed from string", () => {
      MockStorage.set("s:entriesPerPage", "20");
      expect(Settings.entriesPerPage).to.equal(20);
    });

    it("should write value as string when set", () => {
      MockStorage.assert("s:entriesPerPage", undefined);
      Settings.entriesPerPage = 20;
      MockStorage.assert("s:entriesPerPage", "20");
    });
  });

  describe("StoredStringArray", () => {
    it("should be an empty array by default", () => {
      MockStorage.assert("s:projectUuids", undefined);
      expect(Settings.projectUuids).to.be.an("Array").that.is.empty;
    });

    it("should return array of strings when accessed", () => {
      MockStorage.set("s:projectUuids", '["12345","54321"]');
      const projectUuids = Settings.projectUuids;
      expect(projectUuids).to.be.an("Array").with.lengthOf(2);
      expect(projectUuids[0]).to.equal("12345");
      expect(projectUuids[1]).to.equal("54321");
    });

    it("should write JSON string when set", () => {
      MockStorage.assert("s:projectUuids", undefined);
      Settings.projectUuids = ["12345", "54321"];
      MockStorage.assert("s:projectUuids", '["12345","54321"]');
    });
  });
});
