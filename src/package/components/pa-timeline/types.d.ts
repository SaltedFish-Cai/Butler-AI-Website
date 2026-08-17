/**
 * @module pa-timeline/types
 * @description PaTimeline 类型定义（参考 element-plus el-timeline / el-timeline-item）
 */

/**
 * 时间线组件属性
 * @type object
 * @description PaTimeline 组件的属性类型定义
 */
export type ComponentProps = {
  /**
   * 组件唯一标识
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会作为组件的唯一标识
   */
  id?: string;
  /**
   * render-id
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会作为组件的唯一标识
   */
  renderId?: string;
  /**
   * 自定义类名
   * @type Array<string> | string | undefined
   * @default undefined
   * @description 当设置该值时，会添加到组件的类名中
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string> | undefined
   * @default undefined
   * @description 当设置该值时，会添加到组件的样式中
   */
  style?: Record<string, string>;
};

/**
 * 时间线节点属性
 * @type object
 * @description PaTimelineItem 节点的属性类型定义
 */
export type ComponentItemProps = {
  /**
   * 组件唯一标识
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会作为组件的唯一标识
   */
  id?: string;
  /**
   * render-id
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会作为组件的唯一标识
   */
  renderId?: string;
  /**
   * 自定义类名
   * @type Array<string> | string | undefined
   * @default undefined
   * @description 当设置该值时，会添加到组件的类名中
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string> | undefined
   * @default undefined
   * @description 当设置该值时，会添加到组件的样式中
   */
  style?: Record<string, string>;
  /**
   * 时间戳
   * @type string | undefined
   * @default ""
   * @description 节点展示的时间/标题
   */
  timestamp?: string;
  /**
   * 是否隐藏时间戳
   * @type boolean | undefined
   * @default false
   * @description 当设置该值为 true 时，隐藏时间戳
   */
  hideTimestamp?: boolean;
  /**
   * 是否垂直居中
   * @type boolean | undefined
   * @default false
   * @description 当设置该值为 true 时，内容与节点垂直居中
   */
  center?: boolean;
  /**
   * 时间戳位置
   * @type "top" | "bottom" | undefined
   * @default "bottom"
   * @description 时间戳展示在内容的顶部或底部
   */
  placement?: "bottom" | "top";
  /**
   * 节点类型
   * @type "primary" | "success" | "warning" | "danger" | "info" | undefined
   * @default "primary"
   * @description 节点颜色类型
   */
  type?: "danger" | "info" | "primary" | "success" | "warning";
  /**
   * 节点颜色
   * @type string | undefined
   * @default undefined
   * @description 自定义节点颜色，优先级高于 type
   */
  color?: string;
  /**
   * 是否空心
   * @type boolean | undefined
   * @default false
   * @description 当设置该值为 true 时，节点为空心（仅边框）
   */
  hollow?: boolean;
};
