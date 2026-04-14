import SaSwitch from "./sa-switch.vue";

const install = function (app) {
  if (!app._context.components["SaSwitch"]) app.component("SaSwitch", SaSwitch);
};
export default {
  name: "SaSwitch",
  install
};
