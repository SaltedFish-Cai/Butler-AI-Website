/**
 * 模块导入
 * @description 导入 Vue 类型定义
 */
import type { App } from "vue";
/**
 * 模块导入
 * @description Playground 主组件
 */
import PaPlayground from "./pa-playground.vue";
/**
 * 模块导入
 * @description Playground 可见性组件
 */
import PaPlaygroundVisible from "./pa-playground-visible.vue";

/**
 * 安装 Playground 组件到 Vue 应用
 * @param app Vue 应用实例
 * @description 注册 PaPlayground 和 PaPlaygroundVisible 组件
 */
function install(app: App): void {
  if (!app._context.components["PaPlayground"]) {
    app.component("PaPlayground", PaPlayground);
    app.component("PaPlaygroundVisible", PaPlaygroundVisible);
  }
}

/**
 * 组件名称
 * @type string
 * @description 组件名称
 */
const name = "PaPlayground";

export default { name, install };
