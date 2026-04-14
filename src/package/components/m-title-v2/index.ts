// # Import
import MTitleV2 from "./m-title-v2.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MTitleV2"]) app.component("MTitleV2", MTitleV2);
};

export default {
  name: "MTitleV2",
  install
};
