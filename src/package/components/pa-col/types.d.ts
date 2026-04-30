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
  /** 栅格占据的列数 */
  span?: number;
  /** 栅格左侧的间隔格数 */
  offset?: number;
};

/**
 * PaCol 组件 Props 类型定义
 * @type {Object}
 */
export type ColProps = {
  /** 栅格占据的列数（共24列）
   * @default undefined
   * @type {number | undefined}
   */
  span?: number;
  /** 栅格左侧的间隔格数
   * @default 0
   * @type {number | undefined}
   */
  offset?: number;
  /** <576px 响应式配置
   * @default undefined
   * @type {Responsive | number | undefined}
   */
  xs?: Responsive | number;
  /** ≥576px 响应式配置
   * @default undefined
   * @type {Responsive | number | undefined}
   */
  sm?: Responsive | number;
  /** ≥768px 响应式配置
   * @default undefined
   * @type {Responsive | number | undefined}
   */
  md?: Responsive | number;
  /** ≥992px 响应式配置
   * @default undefined
   * @type {Responsive | number | undefined}
   */
  lg?: Responsive | number;
  /** ≥1200px 响应式配置
   * @default undefined
   * @type {Responsive | number | undefined}
   */
  xl?: Responsive | number;
  /** 自定义类名
   * @default undefined
   * @type {Array<string> | string | undefined}
   */
  class?: Array<string> | string;
  /** 自定义样式
   * @default undefined
   * @type {Record<string, number | string> | undefined}
   */
  style?: Record<string, number | string>;
  /** 元素 id
   * @default undefined
   * @type {string | undefined}
   */
  id?: string;
};

/**
 * PaCol 组件 Props
 */
export type ComponentProps = ColProps;
