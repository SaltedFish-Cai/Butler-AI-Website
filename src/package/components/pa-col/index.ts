/**
 * @module pa-col
 * @description 栅格列组件，需配合 pa-row 使用
 */
/** @description Vue 应用实例类型 */
import type { App } from "vue";
/** @description PaCol 栅格列组件 */
import PaCol from "./pa-col.vue";
/**
 * 注册 PaCol 组件
 * @description 将 PaCol 组件注册到 Vue 应用中
 * @param app Vue 应用实例
 */
const install = function (app: App): void {
  if (!app._context.components["PaCol"]) app.component("PaCol", PaCol);
};
/** PaCol 组件名称 */
export default {
  name: "PaCol",
  install
};
