/**
 * Vue 应用类型
 * @description 导入 Vue 应用类型
 */
import type { App } from "vue";
/**
 * 颜色选择器组件
 * @description 导入 PaColor 和 PaColorBox 组件
 */
import PaColor from "./pa-color.vue";
/**
 * 颜色选择面板组件
 * @description 导入 PaColorBox 组件
 */
import PaColorBox from "./pa-color-box.vue";
/**
 * 组件名称
 * @description 组件注册名称
 */
const name = "PaColor";
/**
 * 组件注册函数
 * @param app - Vue 应用实例
 * @description 将 PaColor 和 PaColorBox 组件注册到 Vue 应用中
 */
const install = function (app: App): void {
  if (!app._context.components["PaColor"]) {
    app.component("PaColor", PaColor);
    app.component("PaColorBox", PaColorBox);
  }
};
export default { name, install };
