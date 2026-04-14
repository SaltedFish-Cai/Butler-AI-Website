import SaTag from "./sa-tag.vue";

const install = function (app) {
  if (!app._context.components["SaTag"]) app.component("SaTag", SaTag);
};
export default {
  name: "SaTag",
  install
};
