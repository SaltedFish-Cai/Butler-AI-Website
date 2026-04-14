import MCascaderV2 from "./m-cascader-v2.vue";

const install = function (app) {
  if (!app._context.components["MCascaderV2"]) app.component("MCascaderV2", MCascaderV2);
};
export default {
  name: "MCascaderV2",
  install
};
