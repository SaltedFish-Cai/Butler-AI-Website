import type { App } from "vue";
import PaMenu from "./pa-menu.vue";
import PaMenuItem from "../pa-menu-item/pa-menu-item.vue";

const name = "PaMenu";

const install = function (app: App): void {
  if (!app._context.components["PaMenu"]) {
    app.component("PaMenu", PaMenu);
    app.component("PaMenuItem", PaMenuItem);
  }
};

export default { name, install };
