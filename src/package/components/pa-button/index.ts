// # Import
import PaButton from "./pa-button.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["PaButton"]) {
    app.component("PaButton", PaButton);
  }
};

export default { name: "PaButton", install };
