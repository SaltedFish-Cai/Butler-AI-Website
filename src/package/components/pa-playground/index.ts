import PaPlayground from "./pa-playground.vue";
import PaPlaygroundVisible from "./pa-playground-visible.vue";

/**
 * @description 安装 Playground 组件到 Vue 应用
 * @param app Vue 应用实例
 * */
function install(app: {
  GlobalState: any;
  _context: { components: Record<string, unknown> };
  component: (name: string, comp: unknown) => void;
}) {
  if (!app.GlobalState) app.GlobalState = {};
  if (!app._context.components["PaPlayground"]) {
    app.component("PaPlayground", PaPlayground);
    app.component("PaPlaygroundVisible", PaPlaygroundVisible);
  }
}

/**
 * @description 组件名称
 * @type `string`
 * */
const name = "PaPlayground";

export default { name, install };
