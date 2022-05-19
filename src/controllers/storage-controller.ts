const STBL_ID_BASE = "__stbl";

interface StorageProperty<T> {
  get: (prop: string) => T;
  set: (prop: string, value: T) => void;
}

interface StorageProperties {
  creatorName: StorageProperty<string>;
  isDarkTheme: StorageProperty<boolean>;
  stblIds: StorageProperty<string[]>;
  nextStblId: StorageProperty<number>;
}

const AppStorage: StorageProperties = {
  creatorName: {
    get(prop: string) {
      return localStorage.getItem(prop);
    },
    set(prop: string, value: string) {
      localStorage.setItem(prop, value);
    }
  },
  isDarkTheme: {
    get(prop: string) {
      const value = localStorage.getItem(prop);
      return (!value) || (value === "true");
    },
    set(prop: string, value: boolean) {
      localStorage.setItem(prop, value ? "true" : "false");
    }
  },
  stblIds: {
    get(prop: string) {
      const value = localStorage.getItem(prop);
      return value ? JSON.parse(value) as string[] : [];
    },
    set(prop: string, value: string[]) {
      localStorage.setItem(prop, JSON.stringify(value));
    }
  },
  nextStblId: {
    get(prop: string) {
      const value = localStorage.getItem(prop) ?? "0";
      return parseInt(value);
    },
    set(prop: string, value: number) {
      localStorage.setItem(prop, value.toString());
    }
  },
}

export default AppStorage;
