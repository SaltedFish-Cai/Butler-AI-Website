import SaCascader from "./sa-cascader.vue";

const install = function (app) {
  if (!app._context.components["SaCascader"]) app.component("SaCascader", SaCascader);
};
export default {
  name: "SaCascader",
  install
};
