/**
 * @module pa-scrollbar/types
 * @description PaScrollBar 滚动条组件类型定义
 */
/**
 * 模块导入
 * @description 导入滚动信息数据类型
 */
import { ScrollInfoData } from "./scrollListener";
/**
 * 组件属性
 * @type object
 * @description 滚动条组件的属性类型定义
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
   * 是否使用阴影
   * @type boolean | undefined
   * @default true
   * @description styleMode='color'时：默认为 false
   */
  useShadow?: boolean;
  /**
   * 是否显示回到顶部按钮
   * @type boolean | undefined
   * @default true
   * @description styleMode='color'时：默认为 false
   */
  useBackTop?: boolean;
  /**
   * 是否开启垂直滚动条
   * @type boolean | undefined
   * @default true
   * @description 是否开启垂直滚动条
   */
  useScrollY?: boolean;
  /**
   * 是否开启水平滚动条
   * @type boolean | undefined
   * @default true
   * @description 是否开启水平滚动条
   */
  useScrollX?: boolean;
  /**
   * 是否显示滚动条内容
   * @type boolean | undefined
   * @default true
   * @description 是否显示滚动条内容
   */
  showThumb?: boolean;
  /**
   * 自定义内容样式
   * @type Record<string, string> | undefined
   * @default undefined
   * @description 当设置该值时，会添加到滚动条内容的样式中
   */
  contentStyle?: Record<string, string>;
  /**
   * 样式模式
   * @type "color" | "default" | undefined
   * @default 'default'
   * @description 当设置该值为 color 时，会将滚动条的样式设置为颜色样式
   */
  styleMode?: "color" | "default";
  /**
   * 滚动条内边距宽度
   * @type number | string | undefined
   * @default var(--pa-size-padding, 10px)
   * @description 滚动条内边距宽度
   */
  paddingWidth?: number | string;
  /**
   * 监听元素类名
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会监听该元素的滚动事件
   */
  intersectClassName?: string;
  /**
   * 内边距方向
   * @type Array<"all" | "bottom" | "left" | "right" | "top"> | undefined
   * @default undefined
   * @description 是否使用内边距
   */
  padding?: Array<"all" | "bottom" | "left" | "right" | "top">;
  /**
   * 边框方向
   * @type Array<"all" | "bottom" | "left" | "right" | "top"> | undefined
   * @default undefined
   * @description 是否使用边框
   */
  border?: Array<"all" | "bottom" | "left" | "right" | "top">;
  /**
   * 内边距边框方向
   * @type Array<"all" | "bottom" | "left" | "right" | "top"> | undefined
   * @default undefined
   * @description 是否使用内边距和边框
   */
  paddingBorder?: Array<"all" | "bottom" | "left" | "right" | "top">;
  /**
   * 默认垂直滚动条位置
   * @type number | undefined
   * @default 0
   * @description 默认垂直滚动条位置
   */
  defaultScrollVerticalThumb?: number;
  /**
   * 默认水平滚动条位置
   * @type number | undefined
   * @default 0
   * @description 默认水平滚动条位置
   */
  defaultScrollHorizontalThumb?: number;
  /**
   * 是否点击外部关闭弹窗
   * @type boolean | undefined
   * @default true
   * @description 是否点击外部关闭弹窗
   */
  useClosePopover?: boolean;
  /**
   * 父元素引用
   * @type HTMLElement | undefined
   * @default undefined
   * @description 父元素引用
   */
  parentBoxRef?: HTMLElement;
};
/**
 * 组件事件类型
 * @type object
 * @description 定义组件可触发的事件
 */
export type ComponentEmits = {
  /**
   * 渲染结束事件
   * @description 滚动条渲染结束时触发
   */
  (e: "renderEnd", data: RenderEndData): void;
  /**
   * 水平尺寸变化事件
   * @description 滚动条水平尺寸变化时触发
   */
  (e: "bodySizeXChange"): void;
  /**
   * 垂直尺寸变化事件
   * @description 滚动条垂直尺寸变化时触发
   */
  (e: "bodySizeYChange"): void;
  /**
   * 滚动事件
   * @description 滚动条滚动时触发（存在节流延迟）
   */
  (e: "scroll", data: ScrollDataType): void;
  /**
   * 滚动结束事件
   * @param value - 是否结束
   * @description 滚动条滚动结束时触发（存在节流延迟）
   */
  (e: "scrollEnd", value: boolean): void;
  /**
   * 滚动开始事件
   * @param value - 是否开始
   * @description 滚动条滚动开始时触发（存在节流延迟）
   */
  (e: "scrollStart", value: boolean): void;
  /**
   * 滚动到左侧事件
   * @param value - 是否到达左侧
   * @description 滚动条滚动到左侧时触发（存在节流延迟）
   */
  (e: "scrollLeft", value: boolean): void;
  /**
   * 滚动到右侧事件
   * @param value - 是否到达右侧
   * @description 滚动条滚动到右侧时触发（存在节流延迟）
   */
  (e: "scrollRight", value: boolean): void;
  /**
   * 元素相交事件
   * @param el - 相交的元素
   * @description 滚动条与元素相交时触发
   */
  (e: "intersecting", el: HTMLElement): void;
  /**
   * 直接滚动事件
   * @description 滚动条直接滚动时触发（无节流延迟）
   */
  (e: "directlyScroll", data: DirectlyScrollData): void;
  /**
   * 子元素变化事件
   * @description 滚动条子元素变化时触发
   */
  (e: "scrollChildChange", data: ScrollChildChangeData): void;
  /**
   * 直接滚动结束事件
   * @param value - 是否结束
   * @description 滚动条直接滚动结束时触发（无节流延迟）
   */
  (e: "directlyScrollEnd", value: boolean): void;
  /**
   * 直接滚动开始事件
   * @param value - 是否开始
   * @description 滚动条直接滚动开始时触发（无节流延迟）
   */
  (e: "directlyScrollStart", value: boolean): void;
  /**
   * 直接滚动到左侧事件
   * @param value - 是否到达左侧
   * @description 滚动条直接滚动到左侧时触发（无节流延迟）
   */
  (e: "directlyScrollLeft", value: boolean): void;
  /**
   * 直接滚动到右侧事件
   * @param value - 是否到达右侧
   * @description 滚动条直接滚动到右侧时触发（无节流延迟）
   */
  (e: "directlyScrollRight", value: boolean): void;
};
/**
 * 滚动数据类型
 * @type object
 * @description 滚动条数据结构
 */
export type ScrollDataType = {
  scrollTop: number;
  scrollLeft: number;
};
/**
 * 渲染结束数据类型
 * @type object
 * @description 渲染结束时返回的数据结构
 */
export type RenderEndData = {
  bodyWidth: number;
  bodyHeight: number;
};
/**
 * 直接滚动数据类型
 * @type object
 * @description 直接滚动事件的数据结构
 */
export type DirectlyScrollData = ScrollInfoData & {
  scrollTop: number;
  scrollLeft: number;
  scrollDirectionY: number;
  scrollDirectionX: number;
};
/**
 * 子元素变化数据类型
 * @type object
 * @description 子元素变化事件的数据结构
 */
export type ScrollChildChangeData = {
  bodyWidth: number;
  bodyHeight: number;
  useScrollX: boolean;
  useScrollY: boolean;
};
