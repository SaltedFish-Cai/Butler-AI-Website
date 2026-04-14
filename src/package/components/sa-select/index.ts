import SaSelect from "./sa-select.vue";

const install = function (app) {
  if (!app._context.components["SaSelect"]) app.component("SaSelect", SaSelect);
};
export default {
  name: "SaSelect",
  install
};
