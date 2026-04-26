/**
 * **模块导入**
 * @description 导入 PaNumber 组件
 * */
import PaNumber from "./pa-number.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaNumber 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaNumber"]) app.component("PaNumber", PaNumber);
};

export default {
  name: "PaNumber",
  install
};
