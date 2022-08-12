import StorageService from "../lib/services/storage.js";
const { expect } = chai;

class _MockStorage {
  get count() {
    return this._values.size;
  }

  constructor() {
    this._values = new Map();
  }

  get(key) {
    return this._values.get(key);
  }

  set(key, value) {
    return this._values.set(key, value);
  }

  clear() {
    this._values.clear();
  }

  assertSetting(key, expected) {
    expect(this.get("s:" + key)).to.equal(expected);
  }
}

const MockStorage = new _MockStorage();

StorageService._storageInterface.read = function (key) {
  return MockStorage.get(key);
};

StorageService._storageInterface.write = function (key, value) {
  MockStorage.set(key, value);
};

export default MockStorage;
