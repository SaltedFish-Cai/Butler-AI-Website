/**
 * PaRow 栅格行组件类型定义
 */
/**
 * 水平排列方式
 * @type {`"center"` | `"end"` | `"space-around"` | `"space-between"` | `"start"`}
 * @description 栅格行的水平排列方式
 */
export type RowJustify = "center" | "end" | "space-around" | "space-between" | "start";
/**
 * 垂直排列方式
 * @type {`"bottom"` | `"center"` | `"top"`}
 * @description 栅格行的垂直排列方式
 */
export type RowAlign = "bottom" | "center" | "top";
/**
 * PaRow 组件 Props 类型
 * @type {Object}
 * @description PaRow 栅格行组件的属性类型定义
 */
export type ComponentProps = {
  /**
   * 元素 id
   * @type `string` | `undefined`
   * @default undefined
   * @description 元素 id
   */
  id?: string;
  /**
   * 自定义类名
   * @type `Array<string>` | `string` | `undefined`
   * @default undefined
   * @description 自定义类名
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type `Record<string, number | string>` | `undefined`
   * @default undefined
   * @description 自定义样式
   */
  style?: Record<string, number | string>;
  /**
   * 栅格间隔
   * @type `number` | `string` | `undefined`
   * @default undefined
   * @description 栅格间隔，支持数字或字符串类型
   */
  gutter?: number | string;
  /**
   * 水平排列方式
   * @type `RowJustify` | `undefined`
   * @default 'start'
   * @description 栅格行的水平排列方式
   */
  justify?: RowJustify;
  /**
   * 垂直排列方式
   * @type `RowAlign` | `undefined`
   * @default 'top'
   * @description 栅格行的垂直排列方式
   */
  align?: RowAlign;
};
