// # Import
import MTableV2 from "./m-table-v2.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MTableV2"]) app.component("MTableV2", MTableV2);
};

export default {
  name: "MTableV2",
  install
};
