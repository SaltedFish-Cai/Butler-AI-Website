import MPaginationV2 from "./m-pagination-v2.vue";

const install = function (app) {
  if (!app._context.components["MPaginationV2"]) app.component("MPaginationV2", MPaginationV2);
};
export default {
  name: "MPaginationV2",
  install
};
