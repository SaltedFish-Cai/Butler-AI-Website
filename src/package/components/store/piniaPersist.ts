import { PersistedStateOptions } from "pinia-plugin-persistedstate";
import inBrowser from "../tools/inBrowser";

// # piniaPersist
const piniaPersistConfig = (key: string, paths?: string[]) => {
  const persist: PersistedStateOptions = {
    key,
    storage: inBrowser ? window.sessionStorage : undefined,
    // storage: sessionStorage,
    paths
  };
  return persist;
};

export default piniaPersistConfig;
