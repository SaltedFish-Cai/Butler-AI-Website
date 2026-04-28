/**
 * **模块导入**
 * @description 导入 PaScrollBar 组件
 * */
import PaScrollBar from "./pa-scrollbar.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaScrollBar 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaScrollBar"]) {
    app.component("PaScrollBar", PaScrollBar);
  }
};

export default {
  name: "PaScrollBar",
  install
};
