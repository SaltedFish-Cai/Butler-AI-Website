/**
 * **模块导入**
 * @description 导入 Vue 应用类型
 * */
import { App } from "vue";

/**
 * **模块导入**
 * @description 导入 PaRadioItem 子组件
 * */
import PaRadioItem from "./pa-radio-item.vue";

/**
 * **模块导入**
 * @description 导入 PaRadio 组件
 * */
import PaRadio from "./pa-radio.vue";

/**
 * **组件注册函数**
 * @param `app` `App` Vue 应用实例
 * @description 将 PaRadio 和 PaRadioItem 组件注册到 Vue 应用中
 * */
const install = function (app: App) {
  if (!app._context.components["PaRadio"]) {
    app.component("PaRadio", PaRadio);
    app.component("PaRadioItem", PaRadioItem);
  }
};

export default { name: "PaRadio", install };
