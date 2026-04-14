// # Import
import MPopoverV2 from "./m-popover-v2.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MPopoverV2"]) {
    app.component("MPopoverV2", MPopoverV2);
  }
};

export default {
  name: "MPopoverV2",
  install
};
