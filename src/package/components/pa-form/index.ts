import type { App } from "vue";
/**
 * **PaForm 表单组件**
 * @description 用于快速搭建带有校验、组合、拆分等功能的表单
 * @description 支持外部配置结构、外置数据绑定、事件回调等功能
 */
import PaForm from "./pa-form.vue";
/**
 * **PaFormControl 表单控制器组件**
 * @description 表单内部数据管理、验证逻辑处理
 */
import PaFormControl from "./pa-form-control.vue";
/**
 * **PaFormItem 表单项组件**
 * @description 表单字段容器，包含标签、校验、错误提示等功能
 */
import PaFormItem from "./pa-form-item.vue";
/**
 * **安装 PaForm 组件**
 * @param app Vue 应用实例
 * @description 注册 PaForm、PaFormControl、PaFormItem 三个组件
 */
const install = function (app: App) {
  if (!app._context.components["PaForm"]) {
    app.component("PaForm", PaForm);
    app.component("PaFormControl", PaFormControl);
    app.component("PaFormItem", PaFormItem);
  }
};
/**
 * **组件名称**
 * @description PaForm 表单组件
 */
export default {
  name: "PaForm",
  install
};
