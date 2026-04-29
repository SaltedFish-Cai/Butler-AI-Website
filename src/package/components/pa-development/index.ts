/** @description 开发工具组件 */
import type { App } from "vue";
/** @description 开发工具组件 */
import PaDevelopment from "./pa-development.vue";
/**
 * 注册 PaDevelopment 组件
 * @param app - Vue 应用实例
 * @description 注册 PaDevelopment 组件到 Vue 应用
 */
function install(app: App): void {
  if (!app._context.components["PaDevelopment"]) app.component("PaDevelopment", PaDevelopment);
}
/** @description 开发工具组件导出 */
export default {
  /** @description 组件名称 */
  name: "PaDevelopment",
  install
};
