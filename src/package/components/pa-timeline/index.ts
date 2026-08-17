/**
 * **模块导入**
 * @description 导入 Vue 应用类型
 */
import type { App } from "vue";
/**
 * **模块导入**
 * @description 导入 PaTimeline 组件
 */
import PaTimeline from "./pa-timeline.vue";
/**
 * **模块导入**
 * @description 导入 PaTimelineItem 节点组件
 */
import PaTimelineItem from "./pa-timeline-item.vue";
/**
 * **组件注册函数**
 * @param `app` `App` Vue 应用实例
 * @description 注册 PaTimeline 与 PaTimelineItem 时间线节点组件
 */
const install = function (app: App): void {
  if (!app._context.components["PaTimeline"]) {
    app.component("PaTimeline", PaTimeline);
    app.component("PaTimelineItem", PaTimelineItem);
  }
};
/**
 * **组件导出**
 * @description 时间线组件导出
 */
export default {
  /**
   * **组件名称**
   * @description 组件名称
   */
  name: "PaTimeline",
  install
};
