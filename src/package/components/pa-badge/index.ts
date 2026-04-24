/**
 * **模块导入**
 * @description 导入 PaBadge 组件
 * */
import PaBadge from "./pa-badge.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaBadge 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaBadge"]) app.component("PaBadge", PaBadge);
};

export default {
  name: "PaBadge",
  install
};
