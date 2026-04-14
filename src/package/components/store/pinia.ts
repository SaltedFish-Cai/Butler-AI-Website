import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// # pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
