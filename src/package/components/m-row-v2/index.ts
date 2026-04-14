// # Import
import MRowV2 from "./m-row-v2.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MRowV2"]) app.component("MRowV2", MRowV2);
};

export default {
  name: "MRowV2",
  install
};
