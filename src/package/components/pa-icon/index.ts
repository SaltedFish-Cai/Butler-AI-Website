/**
 * **模块导入**
 * @description 导入 PaIcon 组件
 * */
import PaIcon from "./pa-icon.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaIcon 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaIcon"]) app.component("PaIcon", PaIcon);
};

export default {
  name: "PaIcon",
  install
};
