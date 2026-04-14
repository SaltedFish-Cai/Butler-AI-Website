// # Import
import mButtonV2 from "./m-button-v2.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MButton"]) {
    app.component("MButtonV2", mButtonV2);
  }
};

export default {
  name: "MButtonV2",
  install
};
