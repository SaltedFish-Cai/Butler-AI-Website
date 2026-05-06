/**
 * 模块导入
 * @description 导入 Vue 应用类型
 */
import { App } from "vue";
/**
 * 模块导入
 * @description 导入级联选择器组件
 */
import PaCascader from "./pa-cascader.vue";
/**
 * 模块导入
 * @description 导入级联选项子组件
 */
import PaCascaderOption from "./pa-cascader-option.vue";
/**
 * 组件名称
 * @description 组件注册名称
 */
const name = "PaCascader";
/**
 * 组件注册函数
 * @param app - Vue 应用实例
 * @description 将 PaCascader 和 PaCascaderOption 组件注册到 Vue 应用中
 */
const install = function (app: App): void {
  if (!app._context.components["PaCascader"]) {
    app.component("PaCascader", PaCascader);
    app.component("PaCascaderOption", PaCascaderOption);
  }
};
export default { name, install };
