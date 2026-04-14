// # Import
import SaDrawer from "./sa-drawer.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaDrawer"]) app.component("SaDrawer", SaDrawer);
};

export default {
  name: "SaDrawer",
  install
};
