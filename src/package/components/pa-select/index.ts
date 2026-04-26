/**
 * **模块导入**
 * @description 导入 PaSelect 组件
 * */
import PaSelect from "./pa-select.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaSelect 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaSelect"]) app.component("PaSelect", PaSelect);
};

export default {
  name: "PaSelect",
  install
};
