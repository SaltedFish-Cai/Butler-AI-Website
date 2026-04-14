// # Import
import SaTabs from "./sa-tabs.vue";
import SaTabsItem from "./sa-tabs-item.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaTabs"]) {
    app.component("SaTabs", SaTabs);
    app.component("SaTabsItem", SaTabsItem);
  }
};

export default {
  name: "SaTabs",
  install
};
