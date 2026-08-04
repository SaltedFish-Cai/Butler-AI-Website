/**
 * 组件属性定义
 */
export type ComponentProps = {
  /**
   * 组件唯一标识
   * @type string | undefined
   */
  id?: string;
  /**
   * render-id
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会作为组件的唯一标识
   */
  renderId?: string;
  /**
   * 自定义类名
   * @type Array<string> | string | undefined
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string> | undefined
   */
  style?: Record<string, string>;
  /**
   * 绑定值
   * @type number | undefined
   */
  modelValue?: number;
  /**
   * 最小值
   * @type number | undefined
   * @default 0
   */
  min?: number;
  /**
   * 最大值
   * @type number | undefined
   * @default 100
   */
  max?: number;
  /**
   * 步长
   * @type number | undefined
   * @default 1
   */
  step?: number;
  /**
   * 是否为范围选择
   * @type boolean | undefined
   * @default false
   */
  range?: boolean;
  /**
   * 标记
   * @type Record<number, string | { label: string; style?: Record<string, string> }> | undefined
   */
  marks?: Record<number, string | { label: string; style?: Record<string, string> }>;
  /**
   * 是否显示 tooltip
   * @type boolean | undefined
   * @default true
   */
  showTooltip?: boolean;
  /**
   * 是否禁用
   * @type boolean | undefined
   * @default false
   */
  disabled?: boolean;
};

/**
 * 组件事件定义
 */
export type ComponentEmits = {
  /**
   * 绑定值更新事件
   * @param value - 更新后的值
   */
  (e: "update:modelValue", value: number): void;
  /**
   * 值变化事件
   * @param value - 变化后的值
   */
  (e: "change", value: number): void;
};
