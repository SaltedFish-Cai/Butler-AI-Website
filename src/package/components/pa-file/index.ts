/**
 * **模块导入**
 * @description 导入 PaFile 组件
 * */
import PaFile from "./pa-file.vue";

/**
 * **模块导入**
 * @description 导入 PaFileCustom 组件
 * */
import PaFileCustom from "./pa-file-custom.vue";

/**
 * **Vue 应用类型**
 * @description 从 vue 中导入 App 类型
 * */
import type { App } from "vue";

/**
 * **组件注册函数**
 * @param `app` `App` Vue 应用实例
 * @description 将 PaFile 和 PaFileCustom 组件注册到 Vue 应用中
 * */
const install = function (app: App): void {
  if (!app._context.components["PaFile"]) {
    app.component("PaFile", PaFile);
    app.component("PaFileCustom", PaFileCustom);
  }
};

export default {
  /**
   * **组件名称**
   * @type `string`
   * @description PaFile 组件的名称标识
   * */
  name: "PaFile",
  install
};
