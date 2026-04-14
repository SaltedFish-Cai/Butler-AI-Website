import MEmptyV2 from "./m-empty-v2.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MEmptyV2"]) app.component("MEmptyV2", MEmptyV2);
};
export default {
  name: "MEmptyV2",
  install
};
