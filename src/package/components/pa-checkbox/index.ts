/**
 * **模块导入**
 * @description 导入 Vue 应用类型
 * */
import { App } from "vue";

/**
 * **模块导入**
 * @description 导入 PaCheckboxItem 和 PaCheckbox 组件
 * */
import PaCheckBoxItem from "./pa-checkbox-item.vue";

/**
 * **模块导入**
 * @description 导入 PaCheckbox 组件
 * */
import PaCheckBox from "./pa-checkbox.vue";

/**
 * **组件注册函数**
 * @param `app` `App` Vue 应用实例
 * @description 将 PaCheckbox 和 PaCheckboxItem 组件注册到 Vue 应用中
 * */
const install = function (app: App) {
  if (!app._context.components["PaCheckBox"]) {
    app.component("PaCheckBox", PaCheckBox);
  }
  if (!app._context.components["PaCheckBoxItem"]) {
    app.component("PaCheckBoxItem", PaCheckBoxItem);
  }
};

export default {
  name: "PaCheckbox",
  install
};
