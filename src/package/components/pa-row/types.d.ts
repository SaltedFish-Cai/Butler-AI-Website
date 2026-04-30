/**
 * PaRow 组件 Props 类型定义
 */
export type ComponentProps = {
  id?: string;
  class?: Array<string> | string;
  style?: Record<string, number | string>;
  gutter?: string;
  justify?: RowJustify;
  align?: RowAlign;
};

/**
 * 水平排列方式
 */
export type RowJustify = "center" | "end" | "space-around" | "space-between" | "start";

/**
 * 垂直排列方式
 */
export type RowAlign = "bottom" | "center" | "top";
