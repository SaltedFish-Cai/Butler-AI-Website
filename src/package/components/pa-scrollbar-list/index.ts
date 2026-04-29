/** @description 滚动列表组件 */
import type { App } from "vue";
/** @description 滚动列表组件 */
import PaScrollBarList from "./pa-scrollbar-list.vue";
/**
 * 注册 PaScrollBarList 组件
 * @param app - Vue 应用实例
 * @description 注册 PaScrollBarList 组件到 Vue 应用
 */
function install(app: App): void {
  if (!app._context.components["PaScrollBarList"]) app.component("PaScrollBarList", PaScrollBarList);
}
/** @description 滚动列表组件导出 */
export default {
  /** @description 组件名称 */
  name: "PaScrollBarList",
  install
};
