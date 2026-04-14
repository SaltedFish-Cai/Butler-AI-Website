import MTransferV2 from "./sa-transfer-v2.vue";

const install = function (app) {
  if (!app._context.components["SaTransferV2"]) app.component("SaTransferV2", MTransferV2);
};
export default {
  name: "SaTransferV2",
  install
};
