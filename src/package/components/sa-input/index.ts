import SaInput from "./sa-input.vue";

const install = function (app) {
  if (!app._context.components["SaInput"]) app.component("SaInput", SaInput);
};
export default {
  name: "SaInput",
  install
};
