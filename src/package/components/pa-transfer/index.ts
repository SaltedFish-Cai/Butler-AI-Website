/**
 * @module pa-transfer
 * @description 穿梭框组件，在两个列表之间进行数据的选择和移动
 */
import type { App } from "vue";
import PaTransfer from "./pa-transfer.vue";

/**
 * 注册 PaTransfer 组件
 * @param app Vue 应用实例
 */
const install = function (app: App): void {
  if (!app._context.components["PaTransfer"]) app.component("PaTransfer", PaTransfer);
};

export default {
  name: "PaTransfer",
  install
};
