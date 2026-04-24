// # Import
import PaButton from "./pa-button.vue";
import PaButtonGroup from "./pa-button-group.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["PaButton"]) {
    app.component("PaButton", PaButton);
    app.component("PaButtonGroup", PaButtonGroup);
  }
};

export default { name: "PaButton", install };
