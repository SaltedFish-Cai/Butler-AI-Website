/**
 * @module pa-row
 * @description 栅格行组件，需配合 pa-col 使用
 */
import type { App } from "vue";
import PaRow from "./pa-row.vue";

/**
 * 注册 PaRow 组件
 * @param app Vue 应用实例
 */
const install = function (app: App): void {
  if (!app._context.components["PaRow"]) app.component("PaRow", PaRow);
};

export default {
  name: "PaRow",
  install
};
