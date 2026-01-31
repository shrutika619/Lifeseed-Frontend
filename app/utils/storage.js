export const storage = {
  get: (key, defaultValue) => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      console.error(`Error loading ${key}`, e);
      return defaultValue;
    }
  },
  set: (key, value) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key}`, e);
    }
  },
  remove: (key) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  }
};