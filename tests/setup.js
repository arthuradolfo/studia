// Node v22+ ships a built-in localStorage that is NOT the full Web Storage API
// (setItem/getItem/removeItem/clear are not functions). The jsdom environment
// should provide a proper one, but Node's built-in shadows it.
// This setup file installs a simple in-memory shim so all tests work.

const store = {};

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      for (const key of Object.keys(store)) delete store[key];
    },
    get length() {
      return Object.keys(store).length;
    },
    key(index) {
      return Object.keys(store)[index] ?? null;
    },
  },
  writable: true,
  configurable: true,
});
