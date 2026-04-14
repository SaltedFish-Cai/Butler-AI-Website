// # Import
import SaForm from "./sa-form.vue";
import SaFormControl from "./sa-form-control.vue";
import SaFormItem from "./sa-form-item.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["SaForm"]) {
    app.component("SaForm", SaForm);
    app.component("SaFormControl", SaFormControl);
    app.component("SaFormItem", SaFormItem);
  }
};

export default {
  name: "SaForm",
  install
};
