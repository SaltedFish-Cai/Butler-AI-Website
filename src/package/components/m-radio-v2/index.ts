import MRadioV2Item from "./m-radio-v2-item.vue";
import MRadioV2 from "./m-radio-v2.vue";

const install = function (app) {
  if (!app._context.components["MRadioV2"]) {
    app.component("MRadioV2", MRadioV2);
  }
  if (!app._context.components["MRadioV2Item"]) {
    app.component("MRadioV2Item", MRadioV2Item);
  }
};
export default {
  name: "MCheckboxV2",
  install
};
