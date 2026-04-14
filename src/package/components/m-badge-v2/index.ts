// # Import
import MBadgeV2 from "./m-badge-v2.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MBadgeV2"]) app.component("MBadgeV2", MBadgeV2);
};

export default {
  name: "MBadgeV2",
  install
};
