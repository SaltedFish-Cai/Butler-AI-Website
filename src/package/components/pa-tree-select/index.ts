/**
 * **模块导入**
 * @description 导入 Vue 应用类型
 */
import type { App } from "vue";
/**
 * **模块导入**
 * @description 导入树选择器组件
 */
import PaTreeSelect from "./pa-tree-select.vue";
/**
 * **模块导入**
 * @description 导入树选择器节点子组件
 */
import PaTreeSelectNode from "./pa-tree-select-node.vue";
/**
 * **组件名称**
 * @description 组件注册名称
 */
const name = "PaTreeSelect";
/**
 * **组件注册函数**
 * @param `app` `App` Vue 应用实例
 * @description 将 PaTreeSelect 和 PaTreeSelectNode 组件注册到 Vue 应用中
 */
const install = function (app: App): void {
  if (!app._context.components["PaTreeSelect"]) {
    app.component("PaTreeSelect", PaTreeSelect);
    app.component("PaTreeSelectNode", PaTreeSelectNode);
  }
};
export default { name, install };
