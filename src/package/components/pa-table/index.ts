/**
 * @description PaTable 组件入口文件
 */
import PaTable from "./pa-table.vue";
/**
 * @description Vue 应用类型
 */
import type { App } from "vue";
/**
 * @description PaTable 组件安装函数
 * @param app Vue 应用实例
 */
const install = function (app: App): void {
  if (!app._context.components["PaTable"]) app.component("PaTable", PaTable);
};
/**
 * @description PaTable 组件名称
 */
const name = "PaTable";
export default { name, install };
