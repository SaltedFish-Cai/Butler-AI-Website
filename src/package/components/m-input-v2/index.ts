import MInputV2 from "./m-input-v2.vue";

const install = function (app) {
  if (!app._context.components["MInputV2"]) app.component("MInputV2", MInputV2);
};
export default {
  name: "MInputV2",
  install
};
