/**
 * 模块导入
 * @description 媒体查看器子项组件
 */
import PaMediaViewItem from "./pa-media-view-item.vue";
/**
 * 模块导入
 * @description 媒体查看器组件
 */
import PaMediaView from "./pa-media-view.vue";
/**
 * 模块导入
 * @description 浏览器环境判断工具
 */
import inBrowser from "../tools/inBrowser";
/**
 * 模块导入
 * @description 动态加载 PDF 相关脚本和样式
 */
function loadPdfScripts(): void {
  if (!inBrowser) return;
  const script1 = (typeof window !== "undefined" && window.document?.createElement("script")) || {};
  script1.src = "/DocumentToDms/library/pdf.js";
  script1.onload = () => {
    const script = (typeof window !== "undefined" && window.document?.createElement("script")) || {};
    script.src = "/DocumentToDms/library/pdfh5.js";
    typeof window !== "undefined" && window.document?.head?.appendChild(script);
  };
  typeof window !== "undefined" && window.document?.head?.appendChild(script1);
  const script2 = (typeof window !== "undefined" && window.document?.createElement("script")) || {};
  script2.src = "/DocumentToDms/library/pdf.worker.js";
  typeof window !== "undefined" && window.document?.head?.appendChild(script2);
  const script3 = (typeof window !== "undefined" && window.document?.createElement("script")) || {};
  script3.src = "/DocumentToDms/library/jquery-3.6.0.min.js";
  typeof window !== "undefined" && window.document?.head?.appendChild(script3);
  const link = (typeof window !== "undefined" && window.document?.createElement("link")) || {};
  link.rel = "stylesheet";
  link.href = "/DocumentToDms/library/pdfh5.min.css";
  typeof window !== "undefined" && window.document?.head?.appendChild(link);
}
/**
 * 模块导入
 * @description 动态加载 Word 相关脚本和样式
 */
function loadWordScripts(): void {
  if (!inBrowser) return;
  const docxScript = (typeof window !== "undefined" && window.document?.createElement("script")) || {};
  docxScript.src = "/DocumentToDms/library/docx@1.6.4.js";
  typeof window !== "undefined" && window.document?.head?.appendChild(docxScript);
  const docxCss = (typeof window !== "undefined" && window.document?.createElement("link")) || {};
  docxCss.rel = "stylesheet";
  docxCss.href = "/DocumentToDms/library/docx@1.6.4.css";
  typeof window !== "undefined" && window.document?.head?.appendChild(docxCss);
}
/**
 * 模块导入
 * @description 动态加载 Excel 相关脚本和样式
 */
function loadExcelScripts(): void {
  if (!inBrowser) return;
  const excelScript = (typeof window !== "undefined" && window.document?.createElement("script")) || {};
  excelScript.src = "/DocumentToDms/library/excel@1.7.14.js";
  typeof window !== "undefined" && window.document?.head?.appendChild(excelScript);
  const excelCss = (typeof window !== "undefined" && window.document?.createElement("link")) || {};
  excelCss.rel = "stylesheet";
  excelCss.href = "/DocumentToDms/library/excel@1.7.14.css";
  typeof window !== "undefined" && window.document?.head?.appendChild(excelCss);
}
loadPdfScripts();
loadWordScripts();
loadExcelScripts();
/**
 * 注册 PaMediaView 组件
 * @param app - Vue 应用实例
 * @description 注册 PaMediaView 和 PaMediaViewItem 组件
 */
function install(app: import("vue").App): void {
  if (!app._context.components["PaMediaView"]) {
    app.component("PaMediaViewItem", PaMediaViewItem);
    app.component("PaMediaView", PaMediaView);
  }
}
/**
 * 模块导入
 * @description 媒体查看器组件导出
 */
export default {
  /**
   * 模块导入
   * @description 组件名称
   */
  name: "PaMediaView",
  install
};
