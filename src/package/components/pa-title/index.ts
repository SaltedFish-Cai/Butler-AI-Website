/**
 * **模块导入**
 * @description 导入 PaTitle 组件
 * */
import PaTitle from "./pa-title.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaTitle 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaTitle"]) app.component("PaTitle", PaTitle);
};

export default {
  name: "PaTitle",
  install
};
