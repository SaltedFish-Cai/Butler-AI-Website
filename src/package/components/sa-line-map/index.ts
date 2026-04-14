import MLineMap from "./sa-line-map.vue";

const install = function (app) {
  if (!app._context.components["MLineMap"]) app.component("MLineMap", MLineMap);
};
export default {
  name: "MLineMap",
  install
};
