// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

let db: IDBDatabase;
let hasInitialized = false;

const DB_NAME = "StblStudioDB";
const DB_VERSION = 1;

const STORE_STBL = "stbls";
const STORE_META = "metadata";
type ObjectStore = typeof STORE_STBL | typeof STORE_META;

//#region Helpers

const getStore = (store: ObjectStore, mode: IDBTransactionMode) => db
  .transaction(store, mode)
  .objectStore(store);

async function handleDbError(event: any) {
  console.error(`Database error: ${event.target.errorCode}`);
}

async function handleDbUpgrade(event: any) {
  // when version increments, make sure the below code doesn't run again
  db.createObjectStore(STORE_STBL);
  db.createObjectStore(STORE_META);
}

async function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (hasInitialized) return resolve();

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    const loadDb = async (event: any) => {
      db = event.target.result;
      db.onerror = handleDbError;
      hasInitialized = true;
    };

    request.onerror = () => {
      reject("Could not initialize indexed database.");
      hasInitialized = true;
    };

    request.onsuccess = (event: any) => {
      loadDb(event).then(() => {
        resolve();
      });
    };

    request.onupgradeneeded = (event: any) => {
      loadDb(event).then(() => {
        handleDbUpgrade(event);
      });
    };
  });
}

//#endregion Helpers

/**
 * An abstraction over indexedDB.
 */
namespace DatabaseService {
  export async function clear(store: ObjectStore) {
    initializeDatabase().then(() => {
      getStore(store, "readwrite").clear();
    });
  }

  export async function getAll(store: ObjectStore): Promise<string[]> {
    return new Promise((resolve, reject) => {
      initializeDatabase().then(() => {
        const request = getStore(store, "readonly").getAll();

        request.onerror = (event: any) => {
          reject(`Could not get item from DB: ${event.target.errorCode}`);
        };

        request.onsuccess = () => {
          resolve(request.result);
        };
      });
    });
  }

  export async function getAllKeys(store: ObjectStore): Promise<string[]> {
    return new Promise((resolve, reject) => {
      initializeDatabase().then(() => {
        const request = getStore(store, "readonly").getAllKeys();

        request.onerror = (event: any) => {
          reject(`Could not get item from DB: ${event.target.errorCode}`);
        };

        request.onsuccess = () => {
          resolve(request.result.map(k => k.toString()));
        };
      });
    });
  }

  export async function getItem(store: ObjectStore, key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      initializeDatabase().then(() => {
        const request = getStore(store, "readonly").get(key);

        request.onerror = (event: any) => {
          reject(`Could not get item from DB: ${event.target.errorCode}`);
        };

        request.onsuccess = () => {
          resolve(request.result);
        };
      });
    });
  }

  export async function removeItem(store: ObjectStore, key: string) {
    initializeDatabase().then(() => {
      getStore(store, "readwrite").delete(key);
    });
  }

  export async function setItem(store: ObjectStore, key: string, value: string) {
    initializeDatabase().then(() => {
      getStore(store, "readwrite").put(value, key);
    });
  }
}

export default DatabaseService;
