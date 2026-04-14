import SaFile from "./sa-file.vue";

const install = function (app) {
  if (!app._context.components["SaFile"]) app.component("SaFile", SaFile);
};
export default {
  name: "SaFile",
  install
};
