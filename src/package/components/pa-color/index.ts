// # Import
import PaColor from "./pa-color.vue";
import PaColorBox from "./pa-color-box.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["PaColor"]) {
    app.component("PaColor", PaColor);
    app.component("PaColorBox", PaColorBox);
  }
};

export default {
  name: "PaColor",
  install
};
