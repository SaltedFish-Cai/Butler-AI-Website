// # Import
import mColorV2 from "./m-color-v2.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MColor"]) {
    app.component("MColorV2", mColorV2);
  }
};

export default {
  name: "MColorV2",
  install
};
