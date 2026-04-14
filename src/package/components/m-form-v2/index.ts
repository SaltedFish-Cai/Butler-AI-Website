// # Import
import MFormV2 from "./m-form-v2.vue";
import MFormV2Control from "./m-form-v2-control.vue";
import MFormV2Item from "./m-form-v2-item.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MFormV2"]) {
    app.component("MFormV2", MFormV2);
    app.component("MFormV2Control", MFormV2Control);
    app.component("MFormV2Item", MFormV2Item);
  }
};

export default {
  name: "MFormV2",
  install
};
