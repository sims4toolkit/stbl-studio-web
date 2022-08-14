import StorageService from "../lib/services/storage.js";

const MockStorage = new Map();

StorageService.clear = function () {
  MockStorage.clear();
};

StorageService.getItem = function (key) {
  return MockStorage.get(key);
};

StorageService.removeItem = function (key) {
  MockStorage.delete(key);
};

StorageService.setItem = function (key, value) {
  MockStorage.set(key, value);
};

export default MockStorage;
