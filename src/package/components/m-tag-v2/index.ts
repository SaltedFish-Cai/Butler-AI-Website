import MTagV2 from "./m-tag-v2.vue";

const install = function (app) {
  if (!app._context.components["MTagV2"]) app.component("MTagV2", MTagV2);
};
export default {
  name: "MTagV2",
  install
};
