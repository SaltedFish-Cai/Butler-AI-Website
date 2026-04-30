/**
 * @module pa-col
 * @description 栅格列组件，需配合 pa-row 使用
 */
import type { App } from "vue";
import PaCol from "./pa-col.vue";

/**
 * 注册 PaCol 组件
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
