/** Vue 应用类型 @description Vue 应用类型 */
import type { App } from "vue";
/** 全局配置组件 @description 全局配置组件 */
import PaManager from "./pa-manager.vue";
/**
 * 注册 PaManager 组件
 * @param app - Vue 应用实例
 * @description 注册 PaManager 组件到 Vue 应用
 */
function install(app: App): void {
  if (!app._context.components["PaManager"]) app.component("PaManager", PaManager);
}
/** 组件名称 @description 组件名称 */
const name = "PaManager";
/** 全局配置组件导出 @description 全局配置组件导出 */
export default { name, install };
