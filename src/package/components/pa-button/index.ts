/**
 * 模块导入
 * @description 导入 Vue 应用类型
 */
import type { App } from "vue";
/**
 * 模块导入
 * @description 导入 PaButton 和 PaButtonGroup 组件
 */
import PaButton from "./pa-button.vue";
import PaButtonGroup from "./pa-button-group.vue";
/**
 * 组件名称
 * @description 组件注册名称
 */
const name = "PaButton";
/**
 * 组件注册函数
 * @param app App Vue 应用实例
 * @description 将 PaButton 和 PaButtonGroup 组件注册到 Vue 应用中
 */
const install = function (app: App): void {
  if (!app._context.components["PaButton"]) {
    app.component("PaButton", PaButton);
    app.component("PaButtonGroup", PaButtonGroup);
  }
};
export default { name, install };
