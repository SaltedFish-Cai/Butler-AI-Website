/**
 * **模块导入**
 * @description 导入语言包类型
 * */
import { LanguagePackageType } from "../manager-type";
/**
 * **组件属性定义**
 * @description 弹出框组件的属性类型
 * */
export type ComponentProps = {
  /**
   * **弹窗标识**
   * @type `string` | `undefined`
   * @default ``
   * @description 弹窗标识
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
   * **弹窗类名**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到弹窗的类名中
   * */
  popoverClass?: string;
  /**
   * **自定义样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * */
  style?: Record<string, string>;
  /**
   * **自定义参考元素样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到参考元素的样式中
   * */
  referenceStyle?: Record<string, string>;
  /**
   * **是否禁用**
   * @type `boolean`
   * @default `false`
   * @description 是否禁用
   * */
  disabled?: boolean;
  /**
   * **弹窗挂载位置**
   * @type `string` | `undefined`
   * @default `body`
   * @description 弹窗挂载位置
   * */
  // eslint-disable-next-line spellcheck/spell-checker
  teleportTo?: string;
  /**
   * **弹窗位置**
   * @type `"bottom" | "top"` | `undefined`
   * @default `top`
   * @description 弹窗位置
   * */
  placement?: "bottom" | "top";
  /**
   * **触发方式**
   * @type `"click" | "hover"` | `undefined`
   * @default `click`
   * @description 触发方式
   * */
  trigger?: "click" | "hover";
  /**
   * **内容类名**
   * @type `string` | `undefined`
   * @default ``
   * @description 内容类名
   * */
  contentClassName?: string;
  /**
   * **弹出层宽度**
   * @type `number` | `undefined`
   * @default `200`
   * @description 弹出层宽度
   * */
  popoverWidth?: number;
  /**
   * **是否阻止事件冒泡**
   * @type `boolean`
   * @default `false`
   * @description 是否阻止事件冒泡
   * */
  stopPropagation?: boolean;
  /**
   * **是否自动宽度**
   * @type `boolean`
   * @default `true`
   * @description 是否自动宽度
   * */
  autoWidth?: boolean;
  /**
   * **是否点击外部关闭**
   * @type `boolean`
   * @default `true`
   * @description 是否点击外部关闭
   * */
  targetClose?: boolean;
  /**
   * **是否粘性**
   * @type `"left" | "right"` | `undefined`
   * @default `undefined`
   * @description 是否粘性
   * */
  sticky?: "left" | "right";
  /**
   * **是否点击滚动关闭**
   * @type `boolean`
   * @default `true`
   * @description 是否点击滚动关闭
   * */
  closeByScroll?: boolean;
  /**
   * **弹窗关闭前触发**
   * @type `() => boolean` | `undefined`
   * @default `undefined`
   * @description 弹窗关闭前触发
   * */
  beforeClose?: () => boolean;
};
/**
 * **组件事件类型**
 * @description 定义组件可触发的事件
 * */
export type ComponentEmits = {
  /**
   * **弹窗状态变化事件**
   * @param `visible` `boolean` 弹窗显示状态
   * @description 弹窗显示状态变化时触发
   * */
  (e: "change", visible: boolean): void;
};
