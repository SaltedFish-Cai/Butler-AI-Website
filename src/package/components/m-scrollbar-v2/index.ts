// # Import
import MScrollBarV2 from "./m-scrollbar-v2.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MScrollBarV2"]) {
    app.component("MScrollBarV2", MScrollBarV2);
  }
};

export default {
  name: "MScrollBarV2",
  install
};
