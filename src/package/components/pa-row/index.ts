/**
 * @module pa-row
 * @description 栅格行组件，需配合 pa-col 使用
 */
/** @description Vue 应用实例类型 */
import type { App } from "vue";
/** @description PaRow 栅格行组件 */
import PaRow from "./pa-row.vue";
/**
 * 注册 PaRow 组件
 * @description 将 PaRow 组件注册到 Vue 应用中
 * @param app Vue 应用实例
 */
const install = function (app: App): void {
  if (!app._context.components["PaRow"]) app.component("PaRow", PaRow);
};
/** PaRow 组件名称 */
export default {
  name: "PaRow",
  install
};
