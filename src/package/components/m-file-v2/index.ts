import MFileV2 from "./m-file-v2.vue";

const install = function (app) {
  if (!app._context.components["MFileV2"]) app.component("MFileV2", MFileV2);
};
export default {
  name: "MFileV2",
  install
};
