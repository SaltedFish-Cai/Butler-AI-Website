/**
 * @module pa-line/types
 * @description PaLine 线条组件类型定义
 */
/**
 * 组件属性
 * @type object
 * @description PaLine 线条组件的属性类型定义
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
   * 内边距
   * @type Array<number | string> | undefined
   * @default undefined
   * @description 当设置该值时，会在标题的对应方向添加内边距
   */
  padding?: Array<number | string>;
  /**
   * 宽度
   * @type string | undefined
   * @default '100%'
   * @description 当设置该值时，会在标题下方添加一个宽度为该值的线
   */
  width?: string;
  /**
   * 高度
   * @type string | undefined
   * @default '2px'
   * @description 当设置该值时，会在标题下方添加一个高度为该值的线
   */
  height?: string;
  /**
   * 颜色
   * @type string | undefined
   * @default 'var(--pa-color-primary-light-6)'
   * @description 当设置该值时，会在标题下方添加一个颜色为该值的线
   */
  borderColor?: string;
  /**
   * 边框样式
   * @type "dashed" | "dotted" | "double" | "groove" | "inset" | "outset" | "ridge" | "solid" | undefined
   * @default 'solid'
   * @description 当设置该值时，会在组件下方添加一个边框样式为该值的线
   */
  borderStyle?: "dashed" | "dotted" | "double" | "groove" | "inset" | "outset" | "ridge" | "solid";
};
