import type { App } from "vue";
/**
 * **模块导入**
 * @description 导入 PaPopover 组件
 * */
import PaPopover from "./pa-popover.vue";
/**
 * **组件名称**
 * @description 组件注册名称
 * */
const name = "PaPopover";
/**
 * **组件注册函数**
 * @param `app` `App` Vue 应用实例
 * @description 将 PaPopover 组件注册到 Vue 应用中
 * */
const install = function (app: App): void {
  if (!app._context.components["PaPopover"]) {
    app.component("PaPopover", PaPopover);
  }
};
export default { name, install };
