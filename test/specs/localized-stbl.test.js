const { expect } = chai;
import LocalizedStringTable from "../lib/localized-stbl.js";

describe("LocalizedStringTable", () => {
  describe("#primaryLocale", () => {
    it("should pass", () => {
      const stbl = new LocalizedStringTable(0, new Set([0]));
      expect(stbl.primaryLocale).to.equal(0);
    });

    it("should fail", () => {
      const stbl = new LocalizedStringTable(0, new Set([0]));
      expect(stbl.primaryLocale).to.equal(1);
    });
  });
});
