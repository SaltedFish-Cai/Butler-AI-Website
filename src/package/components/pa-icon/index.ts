/**
 * **模块导入**
 * @description 导入 Vue 应用类型
 * */
import type { App } from "vue";
/**
 * **模块导入**
 * @description 导入 PaIcon 组件
 * */
import PaIcon from "./pa-icon.vue";
/**
 * **组件名称**
 * @description 组件注册名称
 * */
const name = "PaIcon";
/**
 * **组件注册函数**
 * @param `app` `App` Vue 应用实例
 * @description 将 PaIcon 组件注册到 Vue 应用中
 * */
const install = function (app: App) {
  if (!app._context.components["PaIcon"]) app.component("PaIcon", PaIcon);
};

export default { name, install };
