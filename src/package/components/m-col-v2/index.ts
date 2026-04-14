// # Import
import MColV2 from "./m-col-v2.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MColV2"]) app.component("MColV2", MColV2);
};

export default {
  name: "MColV2",
  install
};
