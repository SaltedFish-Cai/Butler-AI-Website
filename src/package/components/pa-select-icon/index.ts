/**
 * **模块导入**
 * @description 导入 PaSelectIcon 组件
 * */
import PaSelectIcon from "./pa-select-icon.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaSelectIcon 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaSelectIcon"]) {
    app.component("PaSelectIcon", PaSelectIcon);
  }
};

export default { name: "PaSelectIcon", install };
