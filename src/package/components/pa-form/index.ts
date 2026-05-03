/**
 * 模块导入
 * @description Vue 应用实例类型
 */
import type { App } from "vue";
/**
 * PaForm 表单组件
 * @description 用于快速搭建带有校验、组合、拆分等功能的表单
 */
import PaForm from "./pa-form.vue";
/**
 * PaFormControl 表单控制器组件
 * @description 表单内部数据管理、验证逻辑处理
 */
import PaFormControl from "./pa-form-control.vue";
/**
 * PaFormItem 表单项组件
 * @description 表单字段容器，包含标签、校验、错误提示等功能
 */
import PaFormItem from "./pa-form-item.vue";
/**
 * 安装 PaForm 组件
 * @param app - Vue 应用实例
 * @description 注册 PaForm、PaFormControl、PaFormItem 三个组件
 */
function install(app: App): void {
  if (!app._context.components["PaForm"]) {
    app.component("PaForm", PaForm);
    app.component("PaFormControl", PaFormControl);
    app.component("PaFormItem", PaFormItem);
  }
}
/**
 * 模块导入
 * @description 组件名称
 */
const name = "PaForm";
/**
 * 模块导入
 * @description PaForm 表单组件导出
 */
export default { name, install };
