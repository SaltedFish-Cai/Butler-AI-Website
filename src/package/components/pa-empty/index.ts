/**
 * **模块导入**
 * @description 导入 PaEmpty 组件
 * */
import PaEmpty from "./pa-empty.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaEmpty 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaEmpty"]) app.component("PaEmpty", PaEmpty);
};

export default {
  name: "PaEmpty",
  install
};
