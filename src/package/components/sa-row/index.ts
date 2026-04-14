// # Import
import SaRow from "./sa-row.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaRow"]) app.component("SaRow", SaRow);
};

export default {
  name: "SaRow",
  install
};
