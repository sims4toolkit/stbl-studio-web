import DatabaseService from "../lib/services/database.js";

const MockDatabase = {
  stbls: new Map(),
  metadata: new Map(),
};

DatabaseService.clear = async (store) => {
  MockDatabase[store].clear();
};

DatabaseService.getAll = async (store) => {
  return [...MockDatabase[store].values()];
};

DatabaseService.getAllKeys = async (store) => {
  return [...MockDatabase[store].keys()];
};

DatabaseService.getItem = async (store, key) => {
  return MockDatabase[store].get(key);
};

DatabaseService.removeItem = async (store, key) => {
  return MockDatabase[store].delete(key);
};

DatabaseService.setItem = async (store, key, value) => {
  return MockDatabase[store].set(key, value);
};

export default MockDatabase;
