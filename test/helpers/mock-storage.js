import StorageService from "../lib/services/storage";
const { expect } = chai;

class _MockStorage {
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

  expect(key, expected) {
    expect(this.get(key)).to.equal(expected);
  }
}

const MockStorage = new _MockStorage();

StorageService._readItem = function (key) {
  return MockStorage.get(key);
};

StorageService._writeItem = function (key, value) {
  return MockStorage.set(key, value);
};

export default MockStorage;
