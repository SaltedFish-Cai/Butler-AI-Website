/**
 * @module pa-row/types
 * @description PaRow 栅格行组件类型定义
 */
/**
 * 水平排列方式
 * @type "center" | "end" | "space-around" | "space-between" | "start"
 * @description 栅格行的水平排列方式
 */
export type RowJustify = "center" | "end" | "space-around" | "space-between" | "start";
/**
 * 垂直排列方式
 * @type "bottom" | "center" | "top"
 * @description 栅格行的垂直排列方式
 */
export type RowAlign = "bottom" | "center" | "top";
/**
 * 组件属性
 * @type object
 * @description PaRow 栅格行组件的属性类型定义
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
   * @type Record<string, number | string> | undefined
   * @default undefined
   * @description 当设置该值时，会添加到组件的样式中
   */
  style?: Record<string, number | string>;
  /**
   * 栅格间隔
   * @type number | string | undefined
   * @default undefined
   * @description 栅格间隔，支持数字或字符串类型
   */
  gutter?: number | string;
  /**
   * 水平排列方式
   * @type RowJustify | undefined
   * @default 'start'
   * @description 栅格行的水平排列方式
   */
  justify?: RowJustify;
  /**
   * 垂直排列方式
   * @type RowAlign | undefined
   * @default 'top'
   * @description 栅格行的垂直排列方式
   */
  align?: RowAlign;
};
