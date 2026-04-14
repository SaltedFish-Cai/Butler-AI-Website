// # Import
import MDialogV2 from "./m-dialog-v2.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MDialogV2"]) app.component("MDialogV2", MDialogV2);
};

export default {
  name: "MDialogV2",
  install
};
