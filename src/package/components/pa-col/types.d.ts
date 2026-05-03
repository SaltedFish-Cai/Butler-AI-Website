/**
 * @module pa-col/types
 * @description PaCol 栅格列组件类型定义
 */
/**
 * 响应式断点类型
 * @type "lg" | "md" | "sm" | "xl" | "xs"
 * @description 栅格系统的响应式断点类型
 */
export type BreakPoint = "lg" | "md" | "sm" | "xl" | "xs";
/**
 * 响应式配置类型
 * @type object
 * @description 栅格列在不同断点下的响应式配置
 */
export type Responsive = {
  /**
   * 栅格占据的列数
   * @type number | undefined
   * @default undefined
   * @description 栅格占据的列数
   */
  span?: number;
  /**
   * 栅格左侧的间隔格数
   * @type number | undefined
   * @default undefined
   * @description 栅格左侧的间隔格数
   */
  offset?: number;
};
/**
 * 组件属性
 * @type object
 * @description PaCol 栅格列组件的属性类型定义
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
   * @description 栅格间隔，可覆盖 Row 组件传入的 gutter 值
   */
  gutter?: number | string;
  /**
   * 栅格占据的列数
   * @type number | undefined
   * @default undefined
   * @description 栅格占据的列数（共24列）
   */
  span?: number;
  /**
   * 栅格左侧的间隔格数
   * @type number | undefined
   * @default 0
   * @description 栅格左侧的间隔格数
   */
  offset?: number;
  /**
   * <576px 响应式配置
   * @type Responsive | number | undefined
   * @default undefined
   * @description <576px 响应式配置
   */
  xs?: Responsive | number;
  /**
   * ≥576px 响应式配置
   * @type Responsive | number | undefined
   * @default undefined
   * @description ≥576px 响应式配置
   */
  sm?: Responsive | number;
  /**
   * ≥768px 响应式配置
   * @type Responsive | number | undefined
   * @default undefined
   * @description ≥768px 响应式配置
   */
  md?: Responsive | number;
  /**
   * ≥992px 响应式配置
   * @type Responsive | number | undefined
   * @default undefined
   * @description ≥992px 响应式配置
   */
  lg?: Responsive | number;
  /**
   * ≥1200px 响应式配置
   * @type Responsive | number | undefined
   * @default undefined
   * @description ≥1200px 响应式配置
   */
  xl?: Responsive | number;
};
