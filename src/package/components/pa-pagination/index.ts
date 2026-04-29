/**
 * **模块导入**
 * @description 导入 Vue 应用类型
 * */
import { App } from "vue";
/**
 * **模块导入**
 * @description 导入 PaPagination 组件
 * */
import PaPagination from "./pa-pagination.vue";
/**
 * **组件名称**
 * @description 组件注册名称
 * */
const name = "PaPagination";
/**
 * **组件注册函数**
 * @param `app` `App` Vue 应用实例
 * @description 将 PaPagination 组件注册到 Vue 应用中
 * */
const install = function (app: App): void {
  if (!app._context.components["PaPagination"]) {
    app.component("PaPagination", PaPagination);
  }
};
export default { name, install };
