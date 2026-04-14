import MCheckboxV2Item from "./m-checkbox-v2-item.vue";
import MCheckboxV2 from "./m-checkbox-v2.vue";

const install = function (app) {
  if (!app._context.components["MCheckboxV2"]) {
    app.component("MCheckboxV2", MCheckboxV2);
  }
  if (!app._context.components["MCheckboxV2Item"]) {
    app.component("MCheckboxV2Item", MCheckboxV2Item);
  }
};
export default {
  name: "MCheckboxV2",
  install
};
