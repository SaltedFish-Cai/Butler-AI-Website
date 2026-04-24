/**
 * **模块导入**
 * @description 导入 PaTag 组件
 * */
import PaTag from "./pa-tag.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaTag 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaTag"]) app.component("PaTag", PaTag);
};

export default {
  name: "PaTag",
  install
};
