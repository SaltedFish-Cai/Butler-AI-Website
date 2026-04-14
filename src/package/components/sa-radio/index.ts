import SaRadioItem from "./sa-radio-item.vue";
import SaRadio from "./sa-radio.vue";

const install = function (app) {
  if (!app._context.components["SaRadio"]) {
    app.component("SaRadio", SaRadio);
  }
  if (!app._context.components["SaRadioItem"]) {
    app.component("SaRadioItem", SaRadioItem);
  }
};
export default {
  name: "SaCheckbox",
  install
};
