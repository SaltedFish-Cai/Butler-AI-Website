// # Import
import MScrollBarListV2 from "./m-scrollbar-list-v2.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MScrollBarListV2"]) app.component("MScrollBarListV2", MScrollBarListV2);
};

export default {
  name: "MScrollBarListV2",
  install
};
