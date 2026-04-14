// # Import
import MDrawerV2 from "./m-drawer-v2.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MDrawerV2"]) app.component("MDrawerV2", MDrawerV2);
};

export default {
  name: "MDrawerV2",
  install
};
