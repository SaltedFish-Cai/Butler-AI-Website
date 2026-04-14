import MNumberV2 from "./m-number-v2.vue";

const install = function (app) {
  if (!app._context.components["MNumberV2"]) app.component("MNumberV2", MNumberV2);
};
export default {
  name: "MNumberV2",
  install
};
