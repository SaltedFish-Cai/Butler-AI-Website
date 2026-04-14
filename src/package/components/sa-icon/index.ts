import SaIcon from "./sa-icon.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaIcon"]) app.component("SaIcon", SaIcon);
};
export default {
  name: "SaIcon",
  install
};
