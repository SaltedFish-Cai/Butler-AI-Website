/**
 * 模块导入
 * @description 导入 Vue 应用类型
 */
import { App } from "vue";
/**
 * 模块导入
 * @description 导入 PaCheckboxItem 和 PaCheckbox 组件
 */
import PaCheckboxItem from "./pa-checkbox-item.vue";
/**
 * 模块导入
 * @description 导入 PaCheckbox 组件
 */
import PaCheckbox from "./pa-checkbox.vue";
/**
 * 组件名称
 * @description 组件注册名称
 */
const name = "PaCheckbox";
/**
 * 组件注册函数
 * @param app - Vue 应用实例
 * @description 将 PaCheckbox 和 PaCheckboxItem 组件注册到 Vue 应用中
 */
const install = function (app: App): void {
  if (!app._context.components["PaCheckbox"]) {
    app.component("PaCheckbox", PaCheckbox);
  }
  if (!app._context.components["PaCheckboxItem"]) {
    app.component("PaCheckboxItem", PaCheckboxItem);
  }
};

export default { name, install };
