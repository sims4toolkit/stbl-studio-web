const { expect } = chai;
const { StringTableLocale } = window.S4TK.enums;
import LocalizedStringTable from "../lib/models/localized-stbl.js";

describe("LocalizedStringEntry", () => {
  //#region Helpers

  const oneLocaleStbl = () => new LocalizedStringTable(
    StringTableLocale.English,
    new Set([StringTableLocale.English]),
    [
      {
        key: 0x12345678,
        values: new Map([
          [StringTableLocale.English, "First"]
        ])
      },
      {
        key: 0x87654321,
        values: new Map([
          [StringTableLocale.English, "Second"]
        ])
      }
    ]
  );

  const twoLocaleStbl = () => new LocalizedStringTable(
    StringTableLocale.English,
    new Set([
      StringTableLocale.English,
      StringTableLocale.Italian
    ]),
    [
      {
        key: 0x12345678,
        values: new Map([
          [StringTableLocale.English, "First"],
          [StringTableLocale.Italian, "Primo"]
        ])
      },
      {
        key: 0x87654321,
        values: new Map([
          [StringTableLocale.English, "Second"],
          [StringTableLocale.Italian, "Secondo"]
        ])
      }
    ]
  );

  const incompleteStbl = () => new LocalizedStringTable(
    StringTableLocale.English,
    new Set([
      StringTableLocale.English,
      StringTableLocale.Italian
    ]),
    [
      {
        key: 0x12345678,
        values: new Map([
          [StringTableLocale.English, "First"],
          [StringTableLocale.Italian, "Primo"]
        ])
      },
      {
        key: 0x87654321,
        values: new Map([
          [StringTableLocale.English, "Second"]
        ])
      }
    ]
  );

  //#endregion Helpers

  //#region Getters / Setters

  describe("#allLocales", () => {
    it("should return all locales in the stbl", () => {
      const stbl = twoLocaleStbl();
      expect(stbl.allLocales).to.be.an("Array").with.lengthOf(2);
      expect(stbl.allLocales[0]).to.equal(StringTableLocale.English);
      expect(stbl.allLocales[1]).to.equal(StringTableLocale.Italian);
    });

    it("should return the same list if accessed more than once", () => {
      const stbl = twoLocaleStbl();
      const allLocales = stbl.allLocales;
      expect(allLocales).to.equal(stbl.allLocales)
    });

    it("should return a new list if locales were updated", () => {
      const stbl = twoLocaleStbl();
      const allLocales = stbl.allLocales;
      stbl.replaceLocales([StringTableLocale.English]);
      expect(allLocales).to.not.equal(stbl.allLocales);
    });

    it("should return a new list if primary locale is changed to new locale", () => {
      const stbl = twoLocaleStbl();
      const allLocales = stbl.allLocales;
      stbl.primaryLocale = StringTableLocale.Spanish;
      expect(allLocales).to.not.equal(stbl.allLocales);
    });
  });

  describe("#entries", () => {
    it("should return all entries in the stbl", () => {
      // TODO:
    });

    it("should return the same list if accessed more than once", () => {
      // TODO:
    });

    it("should return a new list if an entry was added", () => {
      // TODO:
    });

    it("should return a new list if an entry was deleted", () => {
      // TODO:
    });

    it("should return a new list if entries were replaced", () => {
      // TODO:
    });

    it("should return a new list if entries were imported", () => {
      // TODO:
    });
  });

  describe("#primaryLocale", () => {
    it("should return the primary locale", () => {
      // TODO:
    });

    it("should change the primary locale when set", () => {
      // TODO:
    });

    it("should backfill entries for new primary locale if it is missing any", () => {
      // TODO:
    });

    it("should delete backfilled entries from the old primary locale", () => {
      // TODO:
    });
  });

  //#endregion Getters / Setters

  //#region Initialization

  describe("#constructor", () => {
    it("should use the first argument as a primary locale", () => {
      const stbl = new LocalizedStringTable(StringTableLocale.Italian);
      expect(stbl.primaryLocale).to.equal(StringTableLocale.Italian);
    });

    it("should use a set with only the primary locale if not given", () => {
      const stbl = new LocalizedStringTable(StringTableLocale.English);
      expect(stbl._allLocales.size).to.equal(1);
      expect(stbl._allLocales.has(StringTableLocale.English)).to.be.true;
      expect(stbl._allLocales.has(StringTableLocale.Italian)).to.be.false;
    });

    it("should add the primary locale to all locales if not present", () => {
      const stbl = new LocalizedStringTable(
        StringTableLocale.English,
        new Set([StringTableLocale.Italian])
      );

      expect(stbl._allLocales.size).to.equal(2);
      expect(stbl._allLocales.has(StringTableLocale.English)).to.be.true;
      expect(stbl._allLocales.has(StringTableLocale.Italian)).to.be.true;
    });

    it("should use the given entries in its map (one locale)", () => {
      const stbl = oneLocaleStbl();
      expect(stbl.entries).to.be.an("Array").with.lengthOf(2);
      const [first, second] = stbl.entries;
      expect(first.key).to.equal(0x12345678);
      expect(first.values.get(StringTableLocale.English)).to.equal("First");
      expect(second.key).to.equal(0x87654321);
      expect(second.values.get(StringTableLocale.English)).to.equal("Second");
    });

    it("should use the given entries in its map (two locales)", () => {
      const stbl = twoLocaleStbl();
      expect(stbl.entries).to.be.an("Array").with.lengthOf(2);
      const [first, second] = stbl.entries;
      expect(first.key).to.equal(0x12345678);
      expect(first.values.get(StringTableLocale.English)).to.equal("First");
      expect(first.values.get(StringTableLocale.Italian)).to.equal("Primo");
      expect(second.key).to.equal(0x87654321);
      expect(second.values.get(StringTableLocale.English)).to.equal("Second");
      expect(second.values.get(StringTableLocale.Italian)).to.equal("Secondo");
    });

    it("should assign incremental IDs to each given entry", () => {
      const stbl = oneLocaleStbl();
      expect(stbl.entries).to.be.an("Array").with.lengthOf(2);
      expect(stbl.getEntry(0)).to.not.be.undefined;
      expect(stbl.getEntry(1)).to.not.be.undefined;
      expect(stbl.getEntry(2)).to.be.undefined;
    });
  });

  //#endregion Initialization

  //#region Methods

  describe("#addEntry()", () => {
    it("should add an entry in the primary locale to the STBL", () => {
      // TODO:
    });

    it("should not add an entry to non-primary locales", () => {
      // TODO:
    });

    it("should return the entry that was created", () => {
      // TODO:
    });

    it("should use the next incremental ID", () => {
      // TODO:
    });
  });

  describe("#deleteEntry()", () => {
    it("should delete the specific entry from the stbl", () => {
      // TODO:
    });
  });

  describe("#getEntry()", () => {
    it("should return the entry with the given id", () => {
      // TODO:
    });
  });

  describe("#getJson()", () => {
    context("locale is not provided", () => {
      it("should return a JSON for the primary locale", () => {
        // TODO:
      });
    });

    context("locale is primary", () => {
      it("should return a JSON for the given locale", () => {
        // TODO:
      });
    });

    context("locale is not primary, but is in all locales", () => {
      it("should return a JSON for the given locale", () => {
        // TODO:
      });

      it("should backfill missing strings with the primary locale's value", () => {
        // TODO:
      });
    });

    context("locale is not listed in all locales", () => {
      it("should return a JSON for the given locale", () => {
        // TODO:
      });

      it("should backfill missing strings with the primary locale's value", () => {
        // TODO:
      });
    });
  });

  describe("#getStringTable()", () => {
    context("locale is not provided", () => {
      it("should return a STBL for the primary locale", () => {
        // TODO:
      });
    });

    context("locale is primary", () => {
      it("should return a STBL for the given locale", () => {
        // TODO:
      });
    });

    context("locale is not primary, but is in all locales", () => {
      it("should return a STBL for the given locale", () => {
        // TODO:
      });

      it("should backfill missing strings with the primary locale's value", () => {
        // TODO:
      });
    });

    context("locale is not listed in all locales", () => {
      it("should return a STBL for the given locale", () => {
        // TODO:
      });

      it("should backfill missing strings with the primary locale's value", () => {
        // TODO:
      });
    });
  });

  describe("#getValue()", () => {
    context("locale is not provided", () => {
      it("should return the value for the primary locale", () => {
        const stbl = twoLocaleStbl();
        expect(stbl.getValue(0)).to.equal("First");
      });
    });

    context("locale is primary", () => {
      it("should return the value for the primary locale", () => {
        const stbl = twoLocaleStbl();
        expect(stbl.getValue(0, StringTableLocale.English)).to.equal("First");
      });
    });

    context("locale is not primary, but is in all locales", () => {
      it("should return the value for the given locale if there is one", () => {
        const stbl = twoLocaleStbl();
        expect(stbl.getValue(0, StringTableLocale.Italian)).to.equal("Primo");
      });

      it("should return undefined if there is no value for the given locale", () => {
        const stbl = incompleteStbl();
        expect(stbl.getValue(1, StringTableLocale.Italian)).to.be.undefined;
      });
    });

    context("locale is not listed in all locales", () => {
      it("should return undefined", () => {
        const stbl = twoLocaleStbl();
        expect(stbl.getValue(0, StringTableLocale.Spanish)).to.be.undefined;
      });
    });
  });

  describe("#getValueWithFallback()", () => {
    context("locale is primary", () => {
      it("should return the value for the primary locale", () => {
        const stbl = twoLocaleStbl();
        expect(stbl.getValueWithFallback(0, StringTableLocale.English)).to.equal("First");
      });
    });

    context("locale is not primary, but is in all locales", () => {
      it("should return the value for the given locale if there is one", () => {
        const stbl = twoLocaleStbl();
        expect(stbl.getValueWithFallback(1, StringTableLocale.Italian)).to.equal("Secondo");
      });

      it("should return the value for the primary locale if there is no value for the given locale", () => {
        const stbl = incompleteStbl();
        expect(stbl.getValueWithFallback(1, StringTableLocale.Italian)).to.equal("Second");
      });
    });

    context("locale is not listed in all locales", () => {
      it("should return the value for the primary locale", () => {
        const stbl = twoLocaleStbl();
        expect(stbl.getValueWithFallback(0, StringTableLocale.Spanish)).to.equal("First");
      });
    });
  });

  describe("#hasEntry()", () => {
    it("should return true if an entry with the given ID exists", () => {
      // TODO:
    });

    it("should return false if an entry with the given ID does not exist", () => {
      // TODO:
    });
  });

  describe("#importEntries()", () => {
    context("no locale given", () => {
      it("should import strings to primary locale", () => {
        // TODO:
      });
    });

    context("locale is primary", () => {
      it("should add new entries for all of the given strings", () => {
        // TODO:
      });

      it("should add new entries even if keys are repeated", () => {
        // TODO:
      });

      it("should add new entries even if values are repeated", () => {
        // TODO:
      });
    });

    context("locale is not primary, but is in all locales", () => {
      context("key is already associated with an existing entry", () => {
        it("should set the value of the existing entry in the given locale only", () => {
          // TODO:
        });
      });

      context("key is not associated with an existing entry", () => {
        it("should create an entry and set value for both primary and given locale", () => {
          // TODO:
        });
      });
    });

    context("locale is not listed in all locales", () => {
      it("should throw an exception", () => {
        // TODO:
      });
    });
  });

  describe("#replaceEntries()", () => {
    context("entry with key already exists", () => {
      it("should retain all existing translations", () => {
        // TODO:
      });

      it("should update the primary locale's value", () => {
        // TODO:
      });
    });

    context("entry with key does not exist", () => {
      it("should create new entry in primary locale only", () => {
        // TODO:
      });
    });

    context("is missing entries that exist", () => {
      it("should delete entries who are not in new list", () => {
        // TODO:
      });
    });
  });

  describe("#replaceLocales()", () => {
    // TODO:
  });

  describe("#setKey()", () => {
    it("should set the key of the entry with the given ID", () => {
      // TODO:
    });
  });

  describe("#setValue()", () => {
    context("no locale given", () => {
      it("should set the value of the primary locale", () => {
        const stbl = twoLocaleStbl();
        expect(stbl.getValue(0)).to.equal("First");
        stbl.setValue(0, "New");
        expect(stbl.getValue(0)).to.equal("New");
      });
    });

    context("locale is primary", () => {
      it("should set the value of the primary locale", () => {
        const stbl = twoLocaleStbl();
        expect(stbl.getValue(0)).to.equal("First");
        stbl.setValue(0, "New", StringTableLocale.English);
        expect(stbl.getValue(0)).to.equal("New");
      });
    });

    context("locale is not primary, but is in all locales", () => {
      context("entry already has a translation for this locale", () => {
        it("should set the value of the given locale", () => {
          const stbl = twoLocaleStbl();
          expect(stbl.getValue(0, StringTableLocale.Italian)).to.equal("Primo");
          stbl.setValue(0, "Nuovo", StringTableLocale.Italian);
          expect(stbl.getValue(0, StringTableLocale.Italian)).to.equal("Nuovo");
        });

        it("should delete the translation if value is same as primary locale", () => {
          const stbl = twoLocaleStbl();
          expect(stbl.getValue(0, StringTableLocale.Italian)).to.equal("Primo");
          stbl.setValue(0, "First", StringTableLocale.Italian);
          expect(stbl.getValue(0, StringTableLocale.Italian)).to.be.undefined;
        });
      });
      
      context("entry does not have a value for this locale", () => {
        it("should add a value for the given locale", () => {
          const stbl = incompleteStbl();
          expect(stbl.getValue(1, StringTableLocale.Italian)).to.be.undefined;
          stbl.setValue(1, "Secondo", StringTableLocale.Italian);
          expect(stbl.getValue(1, StringTableLocale.Italian)).to.equal("Secondo");
        });

        it("should delete the translation if value is same as primary locale", () => {
          const stbl = incompleteStbl();
          expect(stbl.getValue(1, StringTableLocale.Italian)).to.be.undefined;
          stbl.setValue(1, "Second", StringTableLocale.Italian);
          expect(stbl.getValue(1, StringTableLocale.Italian)).to.be.undefined;
        });
      });
    });

    context("locale is not listed in all locales", () => {
      it("should throw an exception", () => {
        const stbl = twoLocaleStbl();
        expect(() => stbl.setValue(0, "New", StringTableLocale.Spanish)).to.throw();
      });
    });
  });

  //#endregion Methods
});
