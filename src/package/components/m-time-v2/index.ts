import MTimeV2 from "./m-time-v2.vue";

const install = function (app) {
  if (!app._context.components["MTimeV2"]) app.component("MTimeV2", MTimeV2);
};
export default {
  name: "MTimeV2",
  install
};
