/**
 * **模块导入**
 * @description 导入 Vue 应用类型
 * */
import { App } from "vue";

/**
 * **模块导入**
 * @description 导入 PaNumber 组件
 * */
import PaNumber from "./pa-number.vue";

/**
 * **组件名称**
 * @description 组件注册名称
 * */
const name = "PaNumber";

/**
 * **组件注册函数**
 * @param `app` `App` Vue 应用实例
 * @description 将 PaNumber 组件注册到 Vue 应用中
 * */
const install = function (app: App) {
  if (!app._context.components["PaNumber"]) app.component("PaNumber", PaNumber);
};

export default { name, install };
