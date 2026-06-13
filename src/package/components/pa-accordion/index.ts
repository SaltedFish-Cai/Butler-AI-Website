/**
 * 模块导入
 * @description 导入 Vue 应用类型
 */
import type { App } from "vue";
/**
 * 模块导入
 * @description 导入 PaAccordion 组件
 */
import PaAccordion from "./pa-accordion.vue";
/**
 * 模块导入
 * @description 导入 PaAccordionItem 组件
 */
import PaAccordionItem from "./pa-accordion-item.vue";
/**
 * 组件名称
 * @description 组件注册名称
 */
const name = "PaAccordion";
/**
 * 组件注册函数
 * @param app - Vue 应用实例
 * @description 将 PaAccordion 和 PaAccordionItem 组件注册到 Vue 应用中
 */
const install = function (app: App): void {
  if (!app._context.components["PaAccordion"]) {
    app.component("PaAccordion", PaAccordion);
    app.component("PaAccordionItem", PaAccordionItem);
  }
};
export default { name, install };
