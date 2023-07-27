/**
 * Mocked memeory version of LocalStorage in case a form doesn't exist.
 */
class LocalStorageMemory {
  store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: keyof typeof this.store) {
    return this.store[key] || null;
  }

  setItem(key: keyof typeof this.store, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: keyof typeof this.store) {
    delete this.store[key];
  }
}

let localStorageLocal: LocalStorageMemory | Storage | undefined;

export const localStorage = (): LocalStorageMemory | Storage => {
  if (!localStorageLocal) {
    if (typeof window === 'undefined') {
      localStorageLocal = new LocalStorageMemory();
    } else {
      localStorageLocal = window.localStorage;
    }
  }

  return localStorageLocal;
};

export default localStorage;
