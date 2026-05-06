/**
 * Vue 应用类型
 * @description 导入 Vue 应用类型
 */
import type { App } from "vue";
/**
 * 标签组件
 * @description 导入 PaTag 组件
 */
import PaTag from "./pa-tag.vue";
/**
 * 组件名称
 * @description 组件注册名称
 */
const name = "PaTag";
/**
 * 组件注册函数
 * @param app - Vue 应用实例
 * @description 将 PaTag 组件注册到 Vue 应用中
 */
const install = function (app: App): void {
  if (!app._context.components["PaTag"]) app.component("PaTag", PaTag);
};
export default { name, install };
