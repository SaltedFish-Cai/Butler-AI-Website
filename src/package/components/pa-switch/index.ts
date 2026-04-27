/**
 * **模块导入**
 * @description 导入 PaSwitch 组件
 * */
import PaSwitch from "./pa-switch.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaSwitch 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaSwitch"]) app.component("PaSwitch", PaSwitch);
};

export default {
  name: "PaSwitch",
  install
};
