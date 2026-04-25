/**
 * **模块导入**
 * @description 导入级联选择器组件
 * */
import PaCascader from "./pa-cascader.vue";

/**
 * **模块导入**
 * @description 导入级联选项子组件
 * */
import PaCascaderOption from "./pa-cascader-option.vue";

/**
 * **组件注册**
 * @description 注册级联选择器组件
 * */
const install = function (app) {
  if (!app._context.components["PaCascader"]) {
    app.component("PaCascader", PaCascader);
    app.component("PaCascaderOption", PaCascaderOption);
  }
};

export default {
  name: "PaCascader",
  install
};
