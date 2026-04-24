// # Import
import PaSelectIcon from "./pa-select-icon.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["PaSelectIcon"]) {
    app.component("PaSelectIcon", PaSelectIcon);
  }
};

export default { name: "PaSelectIcon", install };
