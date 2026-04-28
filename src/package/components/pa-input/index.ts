/**
 * **模块导入**
 * @description 导入 Vue 应用类型
 * */
import { App } from "vue";
/**
 * **模块导入**
 * @description 导入 PaInput 组件
 * */
import PaInput from "./pa-input.vue";
/**
 * **组件注册函数**
 * @param `app` `App` Vue 应用实例
 * @description 将 PaInput 组件注册到 Vue 应用中
 * */
function install(app: App) {
  if (!app._context.components["PaInput"]) app.component("PaInput", PaInput);
}
/**
 * **组件名称**
 * @description 组件注册名称
 * */
const name = "PaInput";
/**
 * **组件默认导出**
 * @description 包含组件名称和安装函数的对象
 * */
export default { name, install };
