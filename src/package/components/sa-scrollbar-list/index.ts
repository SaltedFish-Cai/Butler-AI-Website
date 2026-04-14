// # Import
import SaScrollBarList from "./sa-scrollbar-list.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaScrollBarList"]) app.component("SaScrollBarList", SaScrollBarList);
};

export default {
  name: "SaScrollBarList",
  install
};
