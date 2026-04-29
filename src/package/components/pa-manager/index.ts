/** @description Vue 应用类型 */
import type { App } from "vue";
/** @description 全局配置组件 */
import PaManager from "./pa-manager.vue";
/**
 * 注册 PaManager 组件
 * @param app - Vue 应用实例
 * @description 注册 PaManager 组件到 Vue 应用
 */
function install(app: App): void {
  if (!app._context.components["PaManager"]) app.component("PaManager", PaManager);
}
/** @description 全局配置组件导出 */
export default {
  /** @description 组件名称 */
  name: "PaManager",
  install
};
