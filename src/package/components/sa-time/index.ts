import SaTime from "./sa-time.vue";

const install = function (app) {
  if (!app._context.components["SaTime"]) app.component("SaTime", SaTime);
};
export default {
  name: "SaTime",
  install
};
