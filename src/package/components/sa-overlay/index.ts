// # Import
import SaOverlay from "./sa-overlay.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaOverlay"]) app.component("SaOverlay", SaOverlay);
};

export default {
  name: "SaOverlay",
  install
};
