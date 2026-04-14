// # Import
import SaPopover from "./sa-popover.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaPopover"]) {
    app.component("SaPopover", SaPopover);
  }
};

export default {
  name: "SaPopover",
  install
};
