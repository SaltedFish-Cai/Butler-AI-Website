import MIconV2 from "./m-icon-v2.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MIconV2"]) app.component("MIconV2", MIconV2);
};
export default {
  name: "MIconV2",
  install
};
