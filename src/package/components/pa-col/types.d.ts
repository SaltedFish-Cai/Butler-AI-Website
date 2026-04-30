/**
 * PaCol 组件 Props 类型定义
 */
export type ComponentProps = {
  id?: string;
  class?: Array<string> | string;
  style?: Record<string, number | string>;
  gutter?: number | string;
  span?: number;
  offset?: number;
  /** <576px 响应式配置 */
  xs?: Responsive | number;
  /** ≥576px 响应式配置 */
  sm?: Responsive | number;
  /** ≥768px 响应式配置 */
  md?: Responsive | number;
  /** ≥992px 响应式配置 */
  lg?: Responsive | number;
  xl?: Responsive | number;
};

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
