import SaCheckboxItem from "./sa-checkbox-item.vue";
import SaCheckbox from "./sa-checkbox.vue";

const install = function (app) {
  if (!app._context.components["SaCheckbox"]) {
    app.component("SaCheckbox", SaCheckbox);
  }
  if (!app._context.components["SaCheckboxItem"]) {
    app.component("SaCheckboxItem", SaCheckboxItem);
  }
};
export default {
  name: "SaCheckbox",
  install
};
