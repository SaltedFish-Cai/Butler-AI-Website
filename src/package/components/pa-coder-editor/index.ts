/**
 * 模块导入
 * @description 导入 Vue 应用类型
 */
import { App } from "vue";
/**
 * 模块导入
 * @description 导入 PaCoderEditor 组件
 */
import PaCoderEditor from "./pa-coder-editor.vue";
/**
 * 组件名称
 * @description 组件注册名称
 */
const name = "PaCoderEditor";
/**
 * 组件注册函数
 * @param app - Vue 应用实例
 * @description 将 PaCoderEditor 组件注册到 Vue 应用中
 */
const install = function (app: App): void {
  if (!app._context.components["PaCoderEditor"]) app.component("PaCoderEditor", PaCoderEditor);
};
export default { name, install };
