import type { App } from "vue";
import PaEditor from "./pa-editor.vue";

/**
 * @description 导入 PaEditor 富文本编辑器组件
 */
import inBrowser from "../tools/inBrowser";

/**
 * @description 在浏览器环境下加载 wangEditor.js
 */
if (inBrowser) {
  const script = (typeof window !== "undefined" && window.document?.createElement("script")) || {};
  script.src = "/DocumentToDms/library/wangEditor.js";
  typeof window !== "undefined" && window.document?.head?.appendChild(script);
}

/**
 * @description PaEditor 组件名称
 */
const name = "PaEditor";

/**
 * @description 安装 PaEditor 组件到 Vue 应用
 * @param app - Vue 应用实例
 */
function install(app: App): void {
  if (!app._context.components["PaEditor"]) {
    app.component("PaEditor", PaEditor);
  }
}

export default { name, install };
