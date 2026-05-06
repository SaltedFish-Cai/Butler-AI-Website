/**
 * @module pa-row
 * @description 栅格行组件，需配合 pa-col 使用
 */
/**
 * 模块导入
 * @description 导入 Vue 应用实例类型
 */
import type { App } from "vue";
/**
 * 模块导入
 * @description 导入 PaRow 栅格行组件
 */
import PaRow from "./pa-row.vue";
/**
 * 组件名称
 * @description 组件注册名称 PaRow
 */
const name = "PaRow";
/**
 * 组件注册函数
 * @param app - Vue 应用实例
 * @description 将 PaRow 组件注册到 Vue 应用中
 */
const install = function (app: App): void {
  if (!app._context.components["PaRow"]) app.component("PaRow", PaRow);
};

export default { name, install };
