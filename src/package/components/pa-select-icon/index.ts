/**
 * **模块导入**
 * @description 导入 Vue 应用类型
 * */
import { App } from "vue";

/**
 * **模块导入**
 * @description 导入 PaSelectIcon 组件
 * */
import PaSelectIcon from "./pa-select-icon.vue";

/**
 * **组件注册函数**
 * @param `app` `App` Vue 应用实例
 * @description 将 PaSelectIcon 组件注册到 Vue 应用中
 * */
const install = function (app: App) {
  if (!app._context.components["PaSelectIcon"]) {
    app.component("PaSelectIcon", PaSelectIcon);
  }
};

export default { name: "PaSelectIcon", install };
