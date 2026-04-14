// # Import
import MOverlayV2 from "./m-overlay-v2.vue";

// #Function install
const install = function (app) {
  if (!app._context.components["MOverlayV2"]) app.component("MOverlayV2", MOverlayV2);
};

export default {
  name: "MOverlayV2",
  install
};
