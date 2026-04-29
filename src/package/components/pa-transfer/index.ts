/** @description 穿梭框组件 */
import type { App } from "vue";
/** @description 穿梭框组件 */
import PaTransfer from "./pa-transfer.vue";
/** @description 注册 PaTransfer 组件 */
/** @param app - Vue 应用实例 */
/** @description 注册 PaTransfer 组件到 Vue 应用 */
function install(app: App): void {
  if (!app._context.components["PaTransfer"]) app.component("PaTransfer", PaTransfer);
}
/** @description 穿梭框组件导出 */
export default {
  /** @description 组件名称 */
  name: "PaTransfer",
  install
};
