/**
 * @module pa-col
 * @description 栅格列组件类型定义
 */

/**
 * 响应式断点类型
 */
export type BreakPoint = "lg" | "md" | "sm" | "xl" | "xs";

/**
 * 响应式配置类型
 */
export type Responsive = {
  span?: number;
  offset?: number;
};

/**
 * PaCol 组件 Props 类型定义
 */
export type ColProps = {
  /** 栅格占据的列数（共24列） */
  span?: number;
  /** 栅格左侧的间隔格数 */
  offset?: number;
  /** <576px 响应式配置 */
  xs?: Responsive | number;
  /** ≥576px 响应式配置 */
  sm?: Responsive | number;
  /** ≥768px 响应式配置 */
  md?: Responsive | number;
  /** ≥992px 响应式配置 */
  lg?: Responsive | number;
  /** ≥1200px 响应式配置 */
  xl?: Responsive | number;
  /** 自定义类名 */
  class?: Array<string> | string;
  /** 自定义样式 */
  style?: Record<string, number | string>;
  /** 元素 id */
  id?: string;
};

/**
 * PaCol 组件 Props
 */
export type ComponentProps = ColProps;
