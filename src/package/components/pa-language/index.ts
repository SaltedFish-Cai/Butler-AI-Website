import type { App } from "vue";
import PaLanguage from "./pa-language.vue";

const name = "PaLanguage";

const install = function (app: App): void {
  if (!app._context.components["PaLanguage"]) app.component("PaLanguage", PaLanguage);
};

export default { name, install };
