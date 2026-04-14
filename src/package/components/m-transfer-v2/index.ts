import MTransferV2 from "./m-transfer-v2.vue";

const install = function (app) {
  if (!app._context.components["MTransferV2"]) app.component("MTransferV2", MTransferV2);
};
export default {
  name: "MTransferV2",
  install
};
