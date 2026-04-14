// # Import
import SaColor from "./sa-color.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MColor"]) {
    app.component("SaColor", SaColor);
  }
};

export default {
  name: "SaColor",
  install
};
