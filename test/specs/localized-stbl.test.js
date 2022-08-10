const { expect } = chai;
import LocalizedStringTable from "../lib/models/localized-stbl.js";

describe("LocalizedStringEntry", () => {
  //#region Getters / Setters

  describe("#allLocales", () => {
    it("should return all locales in the stbl", () => {
      // TODO:
    });

    it("should return the same list if accessed more than once", () => {
      // TODO:
    });

    it("should return a new list if locales were updated", () => {
      // TODO:
    });

    it("should return a new list if primary locale was changed", () => {
      // TODO:
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
      // TODO:
    });

    it("should use a set with only the primary locale if not given", () => {
      // TODO:
    });

    it("should add the primary locale to all locales if not present", () => {
      // TODO:
    });

    it("should clone the given entries", () => {
      // TODO:
    });

    it("should use the given entries in its map", () => {
      // TODO:
    });

    it("should assign incremental IDs to each given entry", () => {
      // TODO:
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
        // TODO:
      });
    });

    context("locale is primary", () => {
      it("should return the value for the primary locale", () => {
        // TODO:
      });
    });

    context("locale is not primary, but is in all locales", () => {
      it("should return the value for the given locale if there is one", () => {
        // TODO:
      });

      it("should return undefined if there is no value for the given locale", () => {
        // TODO:
      });
    });

    context("locale is not listed in all locales", () => {
      it("should return undefined", () => {
        // TODO:
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
    // TODO:
  });

  describe("#replaceLocales()", () => {
    // TODO:
  });

  describe("#setKey()", () => {
    it("should set the key of the entry with the given ID", () => {
      // TODO:
    });
  });

  describe("#setString()", () => {
    context("no locale given", () => {
      it("should set the value of the primary locale", () => {
        // TODO:
      });
    });

    context("locale is primary", () => {
      it("should set the value of the primary locale", () => {
        // TODO:
      });
    });

    context("locale is not primary, but is in all locales", () => {
      it("should set the value of the given locale", () => {
        // TODO:
      });
    });

    context("locale is not listed in all locales", () => {
      it("should throw an exception", () => {
        // TODO:
      });
    });
  });

  //#endregion Methods
});
