/**
 * **模块导入**
 * @description 导入 PaColor 和 PaColorBox 组件
 * */
import PaColor from "./pa-color.vue";
import PaColorBox from "./pa-color-box.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaColor 和 PaColorBox 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaColor"]) {
    app.component("PaColor", PaColor);
    app.component("PaColorBox", PaColorBox);
  }
};

export default {
  name: "PaColor",
  install
};
