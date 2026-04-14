// # Import
import SaBadge from "./sa-badge.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaBadge"]) app.component("SaBadge", SaBadge);
};

export default {
  name: "SaBadge",
  install
};
