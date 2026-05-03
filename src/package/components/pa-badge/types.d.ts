/**
 * @module pa-badge/types
 * @description PaBadge 徽标组件类型定义
 */
/**
 * 组件属性
 * @type object
 * @description PaBadge 徽标组件的属性类型定义
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
   * 徽标值
   * @type number | string | undefined
   * @default undefined
   * @description 徽标显示的值
   */
  value?: number | string;
  /**
   * 最大值
   * @type number | string | undefined
   * @default undefined
   * @description 当值超过最大值时显示 maxValue+
   */
  maxValue?: number | string;
  /**
   * 是否显示
   * @type boolean | undefined
   * @default undefined
   * @description 当设置该值为 true 时，显示徽标
   */
  useShow?: boolean;
  /**
   * 使用小红点显示
   * @type boolean | undefined
   * @default undefined
   * @description 当设置该值为 true 时，显示小红点
   */
  useDot?: boolean;
};
