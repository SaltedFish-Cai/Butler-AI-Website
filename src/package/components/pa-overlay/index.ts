/**
 * **模块导入**
 * @description 导入 Vue 应用类型
 * */
import { App } from "vue";
/**
 * **模块导入**
 * @description 导入 PaOverlay 组件
 * */
import PaOverlay from "./pa-overlay.vue";
/**
 * **组件名称**
 * @description 组件注册名称
 * */
const name = "PaOverlay";
/**
 * **组件注册函数**
 * @param `app` `App` Vue 应用实例
 * @description 将 PaOverlay 组件注册到 Vue 应用中
 * */
const install = function (app: App): void {
  if (!app._context.components["PaOverlay"]) {
    app.component("PaOverlay", PaOverlay);
  }
};
export default { name, install };
