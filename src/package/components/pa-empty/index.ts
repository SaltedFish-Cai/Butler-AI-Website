/**
 * 模块导入
 * @description 导入 Vue 应用类型
 */
import type { App } from "vue";
/**
 * 模块导入
 * @description 导入 PaEmpty 组件
 */
import PaEmpty from "./pa-empty.vue";
/**
 * 组件名称
 * @description 组件注册名称
 */
const name = "PaEmpty";
/**
 * 组件注册函数
 * @param app - Vue 应用实例
 * @description 将 PaEmpty 组件注册到 Vue 应用中
 */
const install = function (app: App): void {
  if (!app._context.components["PaEmpty"]) app.component("PaEmpty", PaEmpty);
};

export default { name, install };
