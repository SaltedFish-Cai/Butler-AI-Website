import type { App } from "vue";
import PaPopover from "./pa-popover.vue";

/**
 * 安装 Popover 组件
 * @param app Vue 应用实例
 * */
const install = function (app: App): void {
  if (!app._context.components["PaPopover"]) {
    app.component("PaPopover", PaPopover);
  }
};

export default {
  name: "PaPopover",
  install
};
