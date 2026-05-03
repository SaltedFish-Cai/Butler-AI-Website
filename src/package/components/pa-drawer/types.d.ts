/**
 * @module pa-drawer/types
 * @description PaDrawer 类型定义
 */
/**
 * 模块导入
 * @description 导入语言包类型
 */
import { LanguagePackageType } from "../manager-type";
/**
 * 组件属性定义
 * @description 抽屉弹窗组件的属性类型
 */
/**
 * 组件属性
 * @type object
 * @description PaDrawer 组件的属性类型定义
 */
export type ComponentProps = {
  /**
   * 组件唯一标识
   * @type string | `undefined`
   * @default undefined
   * @description 当设置该值时，会作为组件的唯一标识
   */
  id?: string;
  /**
   * 自定义类名
   * @type Array<string> | `string` | `undefined`
   * @default undefined
   * @description 当设置该值时，会添加到组件的类名中
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string> | `undefined`
   * @default undefined
   * @description 当设置该值时，会添加到组件的样式中
   */
  style?: Record<string, string>;
  /**
   * 是否打开抽屉弹窗
   * @type boolean
   * @description 控制抽屉弹窗的显示状态
   */
  modelValue: boolean;
  /**
   * 抽屉弹窗标题
   * @type LanguagePackageType | `string` | `undefined`
   * @default '标题'
   * @description 设置抽屉弹窗的标题
   */
  title?: LanguagePackageType | string;
  /**
   * 抽屉弹窗副标题
   * @type LanguagePackageType | `string` | `undefined`
   * @default undefined
   * @description 设置抽屉弹窗的副标题
   */
  subTitle?: LanguagePackageType | string;
  /**
   * 抽屉弹窗宽度
   * @type string | `undefined`
   * @default '500px'
   * @description 设置抽屉弹窗的宽度
   */
  width?: string;
  /**
   * 抽屉弹窗高度
   * @type string | `undefined`
   * @default '300px'
   * @description 设置抽屉弹窗的高度
   */
  height?: string;
  /**
   * 内容是否支持滚动
   * @type boolean
   * @default true
   * @description 抽屉弹窗内容是否可滚动
   */
  scroll?: boolean;
  /**
   * 是否使用X轴滚动
   * @type boolean
   * @default false
   * @description 是否启用水平滚动
   */
  useScrollX?: boolean;
  /**
   * 是否点击蒙层关闭抽屉弹窗
   * @type boolean
   * @default true
   * @description 点击蒙层是否关闭抽屉弹窗
   */
  closeOnClickModal?: boolean;
  /**
   * 是否按ESC键关闭抽屉弹窗
   * @type boolean
   * @default true
   * @description 按ESC键是否关闭抽屉弹窗
   */
  closeOnPressEscape?: boolean;
  /**
   * 内边距方向
   * @type Array<'all' | 'bottom' | 'left' | 'right' | 'top'> | `undefined`
   * @default undefined
   * @description 设置抽屉弹窗内容的内边距方向
   */
  padding?: Array<"all" | "bottom" | "left" | "right" | "top">;
  /**
   * 抽屉弹窗位置
   * @type 'bottom' | `'left'` | `'right'` | `'top'`
   * @default 'right'
   * @description 设置抽屉弹窗的显示位置
   */
  position?: "bottom" | "left" | "right" | "top";
};
/**
 * 组件事件类型
 * @description 定义组件可触发的事件
 */
/**
 * 组件事件类型
 * @type object
 * @description PaDrawer 组件的事件类型定义
 */
export type ComponentEmits = {
  /**
   * 更新modelValue事件
   * @param value - 抽屉弹窗显示状态
   * @description 当抽屉弹窗显示状态改变时触发
   */
  (e: "update:modelValue", value: boolean): void;
  /**
   * 关闭事件
   * @param value - 关闭状态
   * @description 当抽屉弹窗关闭时触发
   */
  (e: "closed", value: boolean): void;
};
