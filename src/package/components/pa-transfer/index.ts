import PaTransfer from "./pa-transfer.vue";

const install = function (app) {
  if (!app._context.components["PaTransfer"]) app.component("PaTransfer", PaTransfer);
};
export default {
  name: "PaTransfer",
  install
};
