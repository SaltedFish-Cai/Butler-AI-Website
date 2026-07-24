import { App } from "vue";
import PaPhone from "./pa-phone.vue";

const name = "PaPhone";
const install = function (app: App): void {
  if (!app._context.components["PaPhone"]) {
    app.component("PaPhone", PaPhone);
  }
};
export default { name, install };
