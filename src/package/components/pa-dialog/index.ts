/**
 * 模块导入
 * @description 导入 Vue 应用类型
 */
import { App } from "vue";
/**
 * 模块导入
 * @description 导入 PaDialog 组件
 */
import PaDialog from "./pa-dialog.vue";
/**
 * 组件名称
 * @description 组件注册名称
 */
const name = "PaDialog";
/**
 * 组件注册函数
 * @param app - Vue 应用实例
 * @description 将 PaDialog 组件注册到 Vue 应用中
 */
const install = function (app: App): void {
  if (!app._context.components["PaDialog"]) {
    app.component("PaDialog", PaDialog);
  }
};
export default { name, install };
