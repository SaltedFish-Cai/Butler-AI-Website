// # Import
import MAnimation from "./m-animation.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MAnimation"]) app.component("MAnimation", MAnimation);
};

export default {
  name: "MAnimation",
  install
};
