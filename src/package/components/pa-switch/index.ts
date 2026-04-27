/**
 * **模块导入**
 * @description 导入 Vue 应用类型
 * */
import { App } from "vue";

/**
 * **模块导入**
 * @description 导入 PaSwitch 组件
 * */
import PaSwitch from "./pa-switch.vue";

/**
 * **组件注册函数**
 * @param `app` `App` Vue 应用实例
 * @description 将 PaSwitch 组件注册到 Vue 应用中
 * */
const install = function (app: App) {
  if (!app._context.components["PaSwitch"]) app.component("PaSwitch", PaSwitch);
};

export default {
  name: "PaSwitch",
  install
};
