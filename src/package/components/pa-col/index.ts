/**
 * @module pa-col
 * @description 栅格列组件，需配合 pa-row 使用
 */
/**
 * 模块导入
 * @description 导入 Vue 应用实例类型
 */
import type { App } from "vue";
/**
 * 模块导入
 * @description 导入 PaCol 栅格列组件
 */
import PaCol from "./pa-col.vue";
/**
 * 组件名称
 * @description 组件注册名称 PaCol
 */
const name = "PaCol";
/**
 * 组件注册函数
 * @param app - Vue 应用实例
 * @description 将 PaCol 组件注册到 Vue 应用中
 */
const install = function (app: App): void {
  if (!app._context.components["PaCol"]) app.component("PaCol", PaCol);
};

export default { name, install };
