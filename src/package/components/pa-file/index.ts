/**
 * **模块导入**
 * @description 导入 PaFile 和 PaFileCustom 组件
 * */
import PaFile from "./pa-file.vue";

/**
 * **模块导入**
 * @description 导入 PaFileCustom 组件
 * */
import PaFileCustom from "./pa-file-custom.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaFile 和 PaFileCustom 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaFile"]) {
    app.component("PaFile", PaFile);
    app.component("PaFileCustom", PaFileCustom);
  }
};

export default {
  name: "PaFile",
  install
};
