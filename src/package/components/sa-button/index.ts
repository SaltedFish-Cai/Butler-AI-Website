// # Import
import SaButton from "./sa-button.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaButton"]) {
    app.component("SaButton", SaButton);
  }
};

export default {
  name: "SaButton",
  install
};
