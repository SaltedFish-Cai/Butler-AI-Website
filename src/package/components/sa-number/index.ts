import SaNumber from "./sa-number.vue";

const install = function (app) {
  if (!app._context.components["SaNumber"]) app.component("SaNumber", SaNumber);
};
export default {
  name: "SaNumber",
  install
};
