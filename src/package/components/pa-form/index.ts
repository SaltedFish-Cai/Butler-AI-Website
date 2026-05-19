/**
 * **模块导入**
 * @description 导入 Vue 应用实例类型
 */
import type { App } from "vue";

/**
 * **模块导入**
 * @description 导入 PaForm 表单组件
 */
import PaForm from "./pa-form.vue";

/**
 * **组件注册函数**
 * @param `app` `App` Vue 应用实例
 * @description 将 PaForm、PaFormControl、PaFormItem 组件注册到 Vue 应用中
 */
function install(app: App): void {
  if (!app._context.components["PaForm"]) {
    app.component("PaForm", PaForm);
  }
}

/**
 * **组件名称**
 * @description PaForm 组件的名称标识
 */
const name = "PaForm";

/**
 * **组件导出**
 * @description PaForm 表单组件的默认导出
 */
export default { name, install };
