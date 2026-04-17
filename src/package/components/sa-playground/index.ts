// # Import
import SaPlayground from "./sa-playground.vue";
import SaPlaygroundVisible from "./sa-playground-visible.vue";

// #Function install
const install = function (app) {
  if (!app.GlobalState) app.GlobalState = {};
  if (!app._context.components["SaPlayground"]) {
    app.component("SaPlayground", SaPlayground);
    app.component("SaPlaygroundVisible", SaPlaygroundVisible);
  }
};

export default {
  name: "SaPlayground",
  install
};
