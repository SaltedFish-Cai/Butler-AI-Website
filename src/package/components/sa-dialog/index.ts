// # Import
import SaDialog from "./sa-dialog.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaDialog"]) app.component("SaDialog", SaDialog);
};

export default {
  name: "SaDialog",
  install
};
