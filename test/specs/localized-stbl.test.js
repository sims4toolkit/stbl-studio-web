const { expect } = chai;
const { StringTableLocale } = window.S4TK.enums;
import LocalizedStringTable from "../lib/models/localized-stbl.js";

describe("LocalizedStringTable", () => {
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

    it("should return the same list if accessed more than once", () => {
      const stbl = twoLocaleStbl();
      const entries = stbl.entries;
      expect(entries).to.equal(stbl.entries);
    });

    it("should return a new list if an entry was added", () => {
      const stbl = twoLocaleStbl();
      const entries = stbl.entries;
      stbl.addEntry(0x1234, "Hello");
      expect(entries).to.not.equal(stbl.entries);
    });

    it("should return a new list if an entry was deleted", () => {
      const stbl = twoLocaleStbl();
      const entries = stbl.entries;
      stbl.deleteEntry(0);
      expect(entries).to.not.equal(stbl.entries);
    });

    it("should return a new list if entries were replaced", () => {
      const stbl = twoLocaleStbl();
      const entries = stbl.entries;
      stbl.replaceEntries([ { key: 0x12345678, value: "New" } ]);
      expect(entries).to.not.equal(stbl.entries);
    });

    it("should return a new list if entries were imported", () => {
      const stbl = twoLocaleStbl();
      const entries = stbl.entries;
      stbl.importEntries([ { key: 0x12345678, value: "New" } ]);
      expect(entries).to.not.equal(stbl.entries);
    });
  });

  describe("#numEntries", () => {
    it("should be the number of entries", () => {
      expect((new LocalizedStringTable(0)).numEntries).to.equal(0);
      expect(twoLocaleStbl().numEntries).to.equal(2);
    });
  });

  describe("#numLocales", () => {
    it("should be the number of entries", () => {
      expect(oneLocaleStbl().numLocales).to.equal(1);
      expect(twoLocaleStbl().numLocales).to.equal(2);
    });
  });

  describe("#primaryLocale", () => {
    it("should return the primary locale", () => {
      const stbl = twoLocaleStbl();
      expect(stbl.primaryLocale).to.equal(StringTableLocale.English);
    });

    it("should change the primary locale when set", () => {
      const stbl = twoLocaleStbl();
      expect(stbl.primaryLocale).to.equal(StringTableLocale.English);
      stbl.primaryLocale = StringTableLocale.Italian;
      expect(stbl.primaryLocale).to.equal(StringTableLocale.Italian);
    });

    it("should backfill entries for new primary locale if it is missing any", () => {
      const stbl = incompleteStbl();
      expect(stbl.getValue(1, StringTableLocale.Italian)).to.be.undefined;
      stbl.primaryLocale = StringTableLocale.Italian;
      expect(stbl.getValue(1, StringTableLocale.Italian)).to.equal("Second");
    });

    it("should delete backfilled entries from the old primary locale", () => {
      const stbl = incompleteStbl();
      expect(stbl.getValue(1, StringTableLocale.English)).to.equal("Second");
      stbl.primaryLocale = StringTableLocale.Italian;
      expect(stbl.getValue(1, StringTableLocale.English)).to.be.undefined;
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
      const stbl = twoLocaleStbl();
      expect(stbl.numEntries).to.equal(2);
      expect(() => stbl.getValue(2)).to.throw();
      stbl.addEntry(0x1234, "Hello");
      expect(stbl.numEntries).to.equal(3);
      expect(stbl.getValue(2)).to.equal("Hello");
    });

    it("should not add an entry to non-primary locales", () => {
      const stbl = twoLocaleStbl();
      expect(stbl.numEntries).to.equal(2);
      expect(() => stbl.getValue(2, StringTableLocale.Italian)).to.throw();
      stbl.addEntry(0x1234, "Hello");
      expect(stbl.numEntries).to.equal(3);
      expect(stbl.getValue(2, StringTableLocale.Italian)).to.be.undefined;
    });

    it("should return the entry that was created", () => {
      const stbl = twoLocaleStbl();
      const entry = stbl.addEntry(0x1234, "Hello");
      expect(entry.key).to.equal(0x1234);
      expect(entry.values.get(StringTableLocale.English)).to.equal("Hello");
    });

    it("should use the next incremental ID", () => {
      const stbl = twoLocaleStbl();
      const entry = stbl.addEntry(0x1234, "Hello");
      expect(entry.id).to.equal(2);
    });
  });

  describe("#deleteEntry()", () => {
    it("should delete the specific entry from the stbl", () => {
      const stbl = twoLocaleStbl();
      expect(stbl.numEntries).to.equal(2);
      expect(stbl.getValue(1)).to.not.be.undefined;
      stbl.deleteEntry(1);
      expect(stbl.numEntries).to.equal(1);
      expect(() => stbl.getValue(1)).to.throw();
    });
  });

  describe("#getEntry()", () => {
    it("should return the entry with the given id", () => {
      const stbl = twoLocaleStbl();
      const entry = stbl.getEntry(1);
      expect(entry.id).to.equal(1);
      expect(entry.key).to.equal(0x87654321);
      expect(entry.values.get(StringTableLocale.English)).to.equal("Second");
      expect(entry.values.get(StringTableLocale.Italian)).to.equal("Secondo");
    });
  });

  describe("#getJson()", () => {
    context("locale is not provided", () => {
      it("should return a JSON for the primary locale", () => {
        const stbl = twoLocaleStbl();
        const json = stbl.getJson();
        expect(json).to.be.an("Array").with.lengthOf(2);
        const [first, second] = json;
        expect(first.key).to.equal(0x12345678);
        expect(first.value).to.equal("First");
        expect(second.key).to.equal(0x87654321);
        expect(second.value).to.equal("Second");
      });
    });

    context("locale is primary", () => {
      it("should return a JSON for the given locale", () => {
        const stbl = twoLocaleStbl();
        const json = stbl.getJson(StringTableLocale.English);
        expect(json).to.be.an("Array").with.lengthOf(2);
        const [first, second] = json;
        expect(first.key).to.equal(0x12345678);
        expect(first.value).to.equal("First");
        expect(second.key).to.equal(0x87654321);
        expect(second.value).to.equal("Second");
      });
    });

    context("locale is not primary, but is in all locales", () => {
      it("should return a JSON for the given locale", () => {
        const stbl = twoLocaleStbl();
        const json = stbl.getJson(StringTableLocale.Italian);
        expect(json).to.be.an("Array").with.lengthOf(2);
        const [first, second] = json;
        expect(first.key).to.equal(0x12345678);
        expect(first.value).to.equal("Primo");
        expect(second.key).to.equal(0x87654321);
        expect(second.value).to.equal("Secondo");
      });

      it("should backfill missing strings with the primary locale's value", () => {
        const stbl = incompleteStbl();
        const json = stbl.getJson(StringTableLocale.Italian);
        expect(json).to.be.an("Array").with.lengthOf(2);
        const [first, second] = json;
        expect(first.key).to.equal(0x12345678);
        expect(first.value).to.equal("Primo");
        expect(second.key).to.equal(0x87654321);
        expect(second.value).to.equal("Second");
      });
    });

    context("locale is not listed in all locales", () => {
      it("should backfill missing strings with the primary locale's value", () => {
        const stbl = twoLocaleStbl();
        const json = stbl.getJson(StringTableLocale.Spanish);
        expect(json).to.be.an("Array").with.lengthOf(2);
        const [first, second] = json;
        expect(first.key).to.equal(0x12345678);
        expect(first.value).to.equal("First");
        expect(second.key).to.equal(0x87654321);
        expect(second.value).to.equal("Second");
      });
    });
  });

  describe("#getStringTable()", () => {
    context("locale is not provided", () => {
      it("should return a STBL for the primary locale", () => {
        const stbl = twoLocaleStbl().getStringTable();
        expect(stbl.size).to.equal(2);
        const [first, second] = stbl.entries;
        expect(first.key).to.equal(0x12345678);
        expect(first.value).to.equal("First");
        expect(second.key).to.equal(0x87654321);
        expect(second.value).to.equal("Second");
      });
    });

    context("locale is primary", () => {
      it("should return a STBL for the given locale", () => {
        const stbl = twoLocaleStbl().getStringTable(StringTableLocale.English);
        expect(stbl.size).to.equal(2);
        const [first, second] = stbl.entries;
        expect(first.key).to.equal(0x12345678);
        expect(first.value).to.equal("First");
        expect(second.key).to.equal(0x87654321);
        expect(second.value).to.equal("Second");
      });
    });

    context("locale is not primary, but is in all locales", () => {
      it("should return a STBL for the given locale", () => {
        const stbl = twoLocaleStbl().getStringTable(StringTableLocale.Italian);
        expect(stbl.size).to.equal(2);
        const [first, second] = stbl.entries;
        expect(first.key).to.equal(0x12345678);
        expect(first.value).to.equal("Primo");
        expect(second.key).to.equal(0x87654321);
        expect(second.value).to.equal("Secondo");
      });

      it("should backfill missing strings with the primary locale's value", () => {
        const stbl = incompleteStbl().getStringTable(StringTableLocale.Italian);
        expect(stbl.size).to.equal(2);
        const [first, second] = stbl.entries;
        expect(first.key).to.equal(0x12345678);
        expect(first.value).to.equal("Primo");
        expect(second.key).to.equal(0x87654321);
        expect(second.value).to.equal("Second");
      });
    });

    context("locale is not listed in all locales", () => {
      it("should backfill missing strings with the primary locale's value", () => {
        const stbl = twoLocaleStbl().getStringTable(StringTableLocale.Spanish);
        expect(stbl.size).to.equal(2);
        const [first, second] = stbl.entries;
        expect(first.key).to.equal(0x12345678);
        expect(first.value).to.equal("First");
        expect(second.key).to.equal(0x87654321);
        expect(second.value).to.equal("Second");
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
      const stbl = twoLocaleStbl();
      expect(stbl.hasEntry(1)).to.be.true;
    });

    it("should return false if an entry with the given ID does not exist", () => {
      const stbl = twoLocaleStbl();
      expect(stbl.hasEntry(2)).to.be.false;
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
      it("should delete entries whose keys are not in new list", () => {
        // TODO:
      });
    });
  });

  describe("#replaceLocales()", () => {
    context("missing primary locale", () => {
      it("should throw an exception", () => {
        const stbl = oneLocaleStbl();
        expect(() => stbl.replaceLocales([StringTableLocale.Italian])).to.throw();
      });
    });

    context("has new locales", () => {
      it("should add new locales to allLocales", () => {
        const stbl = oneLocaleStbl();
        expect(stbl._allLocales.has(StringTableLocale.Italian)).to.be.false;
        stbl.replaceLocales([StringTableLocale.English, StringTableLocale.Italian]);
        expect(stbl._allLocales.has(StringTableLocale.Italian)).to.be.true;
      });
    });

    context("missing existing locales", () => {
      it("should remove missing locales from allLocales", () => {
        const stbl = twoLocaleStbl();
        expect(stbl._allLocales.has(StringTableLocale.Italian)).to.be.true;
        stbl.replaceLocales([StringTableLocale.English]);
        expect(stbl._allLocales.has(StringTableLocale.Italian)).to.be.false;
      });

      it("should delete all string values for missing locales", () => {
        const stbl = twoLocaleStbl();

        stbl.entries.forEach(entry => {
          expect(entry.values.get(StringTableLocale.Italian)).to.not.be.undefined;
        });

        stbl.replaceLocales([StringTableLocale.English]);

        stbl.entries.forEach(entry => {
          expect(entry.values.get(StringTableLocale.Italian)).to.be.undefined;
        });
      });

      it("should keep existing locales intact", () => {
        const stbl = twoLocaleStbl();

        stbl.entries.forEach(entry => {
          expect(entry.values.get(StringTableLocale.English)).to.not.be.undefined;
        });

        stbl.replaceLocales([StringTableLocale.English]);

        stbl.entries.forEach(entry => {
          expect(entry.values.get(StringTableLocale.English)).to.not.be.undefined;
        });
      });
    });
  });

  describe("#setKey()", () => {
    it("should set the key of the entry with the given ID", () => {
      const stbl = twoLocaleStbl();
      expect(stbl.getEntry(0).key).to.equal(0x12345678);
      stbl.setKey(0, 0x1234);
      expect(stbl.getEntry(0).key).to.equal(0x1234);
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
