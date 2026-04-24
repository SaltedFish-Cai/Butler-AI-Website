/**
 * **模块导入**
 * @description 导入 PaButton 和 PaButtonGroup 组件
 * */
import PaButton from "./pa-button.vue";
import PaButtonGroup from "./pa-button-group.vue";

/**
 * **组件注册函数**
 * @param `app` `any` Vue 应用实例
 * @description 将 PaButton 和 PaButtonGroup 组件注册到 Vue 应用中
 * */
const install = function (app) {
  if (!app._context.components["PaButton"]) {
    app.component("PaButton", PaButton);
    app.component("PaButtonGroup", PaButtonGroup);
  }
};

export default { name: "PaButton", install };
