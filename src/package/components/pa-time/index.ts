/**
 * **模块导入**
 * @description 导入 PaTime 组件
 * */
import PaTime from "./pa-time.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaTime 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaTime"]) app.component("PaTime", PaTime);
};

export default {
  name: "PaTime",
  install
};
