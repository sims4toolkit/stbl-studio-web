import MockStorage from "../../helpers/mock-storage.js";
import Settings from "../../lib/services/settings.js";
const { expect } = chai;

describe("Settings", () => {
  beforeEach(() => {
    MockStorage.clear();
  });

  describe("StoredBoolean", () => {
    it("should be false by default", () => {
      expect(MockStorage.get("s:disableBlur")).to.be.undefined;
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
      expect(MockStorage.get("s:disableBlur")).to.be.undefined;
      Settings.disableBlur = true;
      expect(MockStorage.get("s:disableBlur")).to.equal("true");
    });

    it("should write 'false' if value is set to false", () => {
      expect(MockStorage.get("s:disableBlur")).to.be.undefined;
      Settings.disableBlur = false;
      expect(MockStorage.get("s:disableBlur")).to.equal("false");
    });
  });

  describe("StoredInteger", () => {
    it("should use default value if doesn't exist (0)", () => {
      expect(MockStorage.get("s:defaultLocale")).to.be.undefined;
      expect(Settings.defaultLocale).to.equal(0);
    });

    it("should use default value if doesn't exist (12)", () => {
      expect(MockStorage.get("s:entriesPerPage")).to.be.undefined;
      expect(Settings.entriesPerPage).to.equal(12);
    });

    it("should return number value parsed from string", () => {
      MockStorage.set("s:entriesPerPage", "20");
      expect(Settings.entriesPerPage).to.equal(20);
    });

    it("should write value as string when set", () => {
      expect(MockStorage.get("s:entriesPerPage")).to.be.undefined;
      Settings.entriesPerPage = 20;
      expect(MockStorage.get("s:entriesPerPage")).to.equal("20");
    });
  });
});
