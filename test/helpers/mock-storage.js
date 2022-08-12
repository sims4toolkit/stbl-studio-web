import StorageService from "../lib/services/storage.js";
const { expect } = chai;

class _MockStorage {
  get count() {
    return this._values.size;
  }

  constructor() {
    this._values = new Map();
  }

  assert(key, expected) {
    expect(this.get(key)).to.equal(expected);
  }

  clear() {
    this._values.clear();
  }

  delete(key) {
    this._values.delete(key);
  }

  get(key) {
    return this._values.get(key);
  }

  set(key, value) {
    return this._values.set(key, value);
  }
}

const MockStorage = new _MockStorage();

StorageService._storageInterface.clear = function (key) {
  MockStorage.clear();
};

StorageService._storageInterface.delete = function (key) {
  MockStorage.delete(key);
};

StorageService._storageInterface.read = function (key) {
  return MockStorage.get(key);
};

StorageService._storageInterface.write = function (key, value) {
  MockStorage.set(key, value);
};

export default MockStorage;
