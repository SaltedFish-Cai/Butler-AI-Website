import SaPagination from "./sa-pagination.vue";

const install = function (app) {
  if (!app._context.components["SaPagination"]) app.component("SaPagination", SaPagination);
};
export default {
  name: "SaPagination",
  install
};
