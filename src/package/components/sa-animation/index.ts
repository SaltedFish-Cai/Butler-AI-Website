// # Import
import SaAnimation from "./sa-animation.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaAnimation"]) app.component("SaAnimation", SaAnimation);
};

export default {
  name: "SaAnimation",
  install
};
