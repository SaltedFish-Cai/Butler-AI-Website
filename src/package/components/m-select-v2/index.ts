import MSelectV2 from "./m-select-v2.vue";

const install = function (app) {
  if (!app._context.components["MSelectV2"]) app.component("MSelectV2", MSelectV2);
};
export default {
  name: "MSelectV2",
  install
};
