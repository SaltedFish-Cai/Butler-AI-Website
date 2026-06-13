/**
 * 模块导入
 * @description 导入 Vue 应用类型
 */
import type { App } from "vue";
/**
 * 模块导入
 * @description 导入 PaSlider 组件
 */
import PaSlider from "./pa-slider.vue";

/**
 * 组件名称
 * @description 组件注册名称
 */
const name = "PaSlider";

/**
 * 组件注册函数
 * @param app - Vue 应用实例
 * @description 将 PaSlider 组件注册到 Vue 应用中
 */
const install = function (app: App): void {
  if (!app._context.components["PaSlider"]) app.component("PaSlider", PaSlider);
};

export default { name, install };
