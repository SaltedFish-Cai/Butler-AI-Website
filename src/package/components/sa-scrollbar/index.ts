// # Import
import SaScrollBar from "./sa-scrollbar.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaScrollBar"]) {
    app.component("SaScrollBar", SaScrollBar);
  }
};

export default {
  name: "SaScrollBar",
  install
};
