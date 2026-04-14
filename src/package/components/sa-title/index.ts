// # Import
import SaTitle from "./sa-title.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaTitle"]) app.component("SaTitle", SaTitle);
};

export default {
  name: "SaTitle",
  install
};
