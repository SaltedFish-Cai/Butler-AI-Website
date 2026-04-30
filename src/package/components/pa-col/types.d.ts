/**
 * @module pa-col
 * @description 栅格列组件类型定义
 */
/**
 * 响应式断点类型
 * @type {`"lg"` | `"md"` | `"sm"` | `"xl"` | `"xs"`}
 * @description 栅格系统的响应式断点类型
 */
export type BreakPoint = "lg" | "md" | "sm" | "xl" | "xs";
/**
 * 响应式配置类型
 * @type {Object}
 * @description 栅格列在不同断点下的响应式配置
 */
export type Responsive = {
  /**
   * 栅格占据的列数
   * @type `number` | `undefined`
   * @default undefined
   * @description 栅格占据的列数
   */
  span?: number;
  /**
   * 栅格左侧的间隔格数
   * @type `number` | `undefined`
   * @default undefined
   * @description 栅格左侧的间隔格数
   */
  offset?: number;
};
/**
 * Col 组件 Props 类型
 * @type {Object}
 * @description PaCol 栅格列组件的属性类型定义
 */
export type ColProps = {
  /**
   * 栅格占据的列数（共24列）
   * @type `number` | `undefined`
   * @default undefined
   * @description 栅格占据的列数（共24列）
   */
  span?: number;
  /**
   * 栅格左侧的间隔格数
   * @type `number` | `undefined`
   * @default 0
   * @description 栅格左侧的间隔格数
   */
  offset?: number;
  /**
   * <576px 响应式配置
   * @type `Responsive` | `number` | `undefined`
   * @default undefined
   * @description <576px 响应式配置
   */
  xs?: Responsive | number;
  /**
   * ≥576px 响应式配置
   * @type `Responsive` | `number` | `undefined`
   * @default undefined
   * @description ≥576px 响应式配置
   */
  sm?: Responsive | number;
  /**
   * ≥768px 响应式配置
   * @type `Responsive` | `number` | `undefined`
   * @default undefined
   * @description ≥768px 响应式配置
   */
  md?: Responsive | number;
  /**
   * ≥992px 响应式配置
   * @type `Responsive` | `number` | `undefined`
   * @default undefined
   * @description ≥992px 响应式配置
   */
  lg?: Responsive | number;
  /**
   * ≥1200px 响应式配置
   * @type `Responsive` | `number` | `undefined`
   * @default undefined
   * @description ≥1200px 响应式配置
   */
  xl?: Responsive | number;
  /**
   * 栅格间隔，覆盖 Row 的 gutter
   * @type `number` | `string` | `undefined`
   * @default undefined
   * @description 栅格间隔，可覆盖 Row 组件传入的 gutter 值
   */
  gutter?: number | string;
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
   * 元素 id
   * @type `string` | `undefined`
   * @default undefined
   * @description 元素 id
   */
  id?: string;
};
/**
 * Col 组件 Props
 * @type {ColProps}
 * @description PaCol 组件的 Props 类型
 */
export type ComponentProps = ColProps;
