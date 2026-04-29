/**
 * **模块导入**
 * @description 导入语言包类型
 * */
import { LanguagePackageType } from "../manager-type";
/**
 * **组件属性定义**
 * @description 弹窗组件的属性类型
 * */
export type ComponentProps = {
  /**
   * **组件唯一标识**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的唯一标识
   * */
  id?: string;
  /**
   * **自定义类名**
   * @type `Array<string>` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   * */
  class?: Array<string> | string;
  /**
   * **自定义样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * */
  style?: Record<string, string>;
  /**
   * **是否打开弹窗**
   * @type `boolean`
   * @description 控制弹窗的显示状态
   * */
  modelValue: boolean;
  /**
   * **弹窗尺寸**
   * @type `'full'` | `'l'` | `'m'` | `'max'` | `'s'`
   * @default `'m'`
   * @description 设置弹窗的尺寸大小
   * */
  size?: "full" | "l" | "m" | "max" | "s";
  /**
   * **弹窗高度**
   * @type `number` | `string` | `'auto'` | `'default'` | `undefined`
   * @default `'auto'`
   * @description 设置弹窗的高度
   * */
  height?: number | string | "auto" | "default";
  /**
   * **弹窗宽度**
   * @type `number` | `string` | `undefined`
   * @default `undefined`
   * @description 设置弹窗的宽度
   * */
  width?: number | string;
  /**
   * **X轴偏移量**
   * @type `number` | `string` | `undefined`
   * @default `0`
   * @description 设置弹窗的X轴偏移量
   * */
  offsetX?: number | string;
  /**
   * **Y轴偏移量**
   * @type `number` | `string` | `undefined`
   * @default `0`
   * @description 设置弹窗的Y轴偏移量
   * */
  offsetY?: number | string;
  /**
   * **是否使用缓存页面**
   * @type `boolean`
   * @default `true`
   * @description 是否缓存弹窗内容
   * */
  keepAlive?: boolean;
  /**
   * **弹窗标题**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `'标题'`
   * @description 设置弹窗的标题
   * */
  title?: LanguagePackageType | string;
  /**
   * **弹窗副标题**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 设置弹窗的副标题
   * */
  subTitle?: LanguagePackageType | string;
  /**
   * **是否开启全屏按钮**
   * @type `boolean`
   * @default `true`
   * @description 是否显示全屏切换按钮
   * */
  useFull?: boolean;
  /**
   * **内容是否支持滚动**
   * @type `boolean`
   * @default `true`
   * @description 弹窗内容是否可滚动
   * */
  scroll?: boolean;
  /**
   * **是否使用X轴滚动**
   * @type `boolean`
   * @default `false`
   * @description 是否启用水平滚动
   * */
  useScrollX?: boolean;
  /**
   * **标题对齐方式**
   * @type `'center'` | `'left'` | `'right'`
   * @default `'left'`
   * @description 设置标题的对齐方式
   * */
  titleAlign?: "center" | "left" | "right";
  /**
   * **是否点击蒙层关闭弹窗**
   * @type `boolean`
   * @default `true`
   * @description 点击蒙层是否关闭弹窗
   * */
  closeOnClickModal?: boolean;
  /**
   * **是否按ESC键关闭弹窗**
   * @type `boolean`
   * @default `true`
   * @description 按ESC键是否关闭弹窗
   * */
  closeOnPressEscape?: boolean;
  /**
   * **内边距方向**
   * @type `Array<'all' | 'bottom' | 'left' | 'right' | 'top'>` | `undefined`
   * @default `undefined`
   * @description 设置弹窗内容的内边距方向
   * */
  padding?: Array<"all" | "bottom" | "left" | "right" | "top">;
};
/**
 * **组件事件类型**
 * @description 定义组件可触发的事件
 * */
export type ComponentEmits = {
  /**
   * **更新modelValue事件**
   * @param `value` `boolean` 弹窗显示状态
   * @description 当弹窗显示状态改变时触发
   * */
  (e: "update:modelValue", value: boolean): void;
  /**
   * **关闭事件**
   * @param `value` `boolean` 关闭状态
   * @description 当弹窗关闭时触发
   * */
  (e: "closed", value: boolean): void;
};
