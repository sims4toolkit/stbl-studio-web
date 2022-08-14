/**
 * An abstraction over localStorage.
 */
namespace StorageService {
  export function clear() {
    localStorage.clear();
  }

  export function getItem(key: string): string {
    return localStorage.getItem(key);
  }

  export function removeItem(key: string) {
    localStorage.removeItem(key);
  }

  export function setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }
}

export default StorageService;
