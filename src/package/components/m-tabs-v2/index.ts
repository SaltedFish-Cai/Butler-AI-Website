// # Import
import MTabsV2 from "./m-tabs-v2.vue";
import MTabsV2Item from "./m-tabs-v2-item.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MTabsV2"]) {
    app.component("MTabsV2", MTabsV2);
    app.component("MTabsV2Item", MTabsV2Item);
  }
};

export default {
  name: "MTabsV2",
  install
};
