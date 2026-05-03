/**
 * @module pa-scrollbar-list
 * @description 滚动列表组件
 */
/**
 * 模块导入
 * @description 导入 Vue 应用实例类型
 */
import type { App } from "vue";
/**
 * 模块导入
 * @description 导入 PaScrollBarList 组件
 */
import PaScrollBarList from "./pa-scrollbar-list.vue";
/**
 * 组件名称
 * @description 组件注册名称 PaScrollBarList
 */
const name = "PaScrollBarList";
/**
 * 组件注册函数
 * @param app - Vue 应用实例
 * @description 注册 PaScrollBarList 组件到 Vue 应用
 */
const install = function (app: App): void {
  if (!app._context.components["PaScrollBarList"]) app.component("PaScrollBarList", PaScrollBarList);
};

export default { name, install };
