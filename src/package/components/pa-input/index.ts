/**
 * **模块导入**
 * @description 导入 PaInput 组件
 * */
import PaInput from "./pa-input.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaInput 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaInput"]) app.component("PaInput", PaInput);
};

export default {
  name: "PaInput",
  install
};
