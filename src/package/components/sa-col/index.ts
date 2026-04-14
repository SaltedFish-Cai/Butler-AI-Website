// # Import
import SaCol from "./sa-col.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaCol"]) app.component("SaCol", SaCol);
};

export default {
  name: "SaCol",
  install
};
