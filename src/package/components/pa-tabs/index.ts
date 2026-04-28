/**
 * **模块导入**
 * @description 导入 Vue 应用类型
 * */
import { App } from "vue";
/**
 * **模块导入**
 * @description 导入 PaTabs 组件
 * */
import PaTabs from "./pa-tabs.vue";
/**
 * **模块导入**
 * @description 导入 PaTabsItem 组件
 * */
import PaTabsItem from "./pa-tabs-item.vue";
/**
 * **组件名称**
 * @description 组件注册名称
 * */
const name = "PaTabs";
/**
 * **组件注册函数**
 * @param `app` `App` Vue 应用实例
 * @description 将 PaTabs 和 PaTabsItem 组件注册到 Vue 应用中
 * */
const install = function (app: App) {
  if (!app._context.components["PaTabs"]) {
    app.component("PaTabs", PaTabs);
    app.component("PaTabsItem", PaTabsItem);
  }
};
export default { name, install };
