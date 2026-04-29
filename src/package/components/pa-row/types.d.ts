/**
 * @module pa-row
 * @description 栅格行组件类型定义
 */

/**
 * 水平排列方式
 */
export type RowJustify = "center" | "end" | "space-around" | "space-between" | "start";

/**
 * 垂直排列方式
 */
export type RowAlign = "bottom" | "middle" | "top";

/**
 * PaRow 组件 Props 类型定义
 */
export type RowProps = {
  /** 栅格间隔 */
  gutter?: string;
  /** 边缘栅格间隔 */
  edgeGutter?: string;
  /** 水平排列方式 */
  justify?: RowJustify;
  /** 垂直排列方式 */
  align?: RowAlign;
  /** 自定义元素标签 */
  tag?: string;
  /** 自定义类名 */
  class?: Array<string> | string;
  /** 自定义样式 */
  style?: Record<string, string | number>;
  /** 元素 id */
  id?: string;
};

/**
 * PaRow 组件 Props
 */
export type ComponentProps = RowProps;
