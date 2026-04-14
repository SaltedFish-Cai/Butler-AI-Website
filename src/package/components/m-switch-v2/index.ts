import MSwitchV2 from "./m-switch-v2.vue";

const install = function (app) {
  if (!app._context.components["MSwitchV2"]) app.component("MSwitchV2", MSwitchV2);
};
export default {
  name: "MSwitchV2",
  install
};
