/**
 * @module pa-overlay/types
 * @description PaOverlay 类型定义
 */
/**
 * 组件属性定义
 * @description 遮罩层组件的属性类型
 */
/**
 * 组件属性
 * @type object
 * @description PaOverlay 组件的属性类型定义
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
   * 是否显示遮罩
   * @type boolean
   * @default false
   * @description 控制遮罩层的显示与隐藏
   */
  modelValue: boolean;
  /**
   * 是否使用阻塞
   * @type boolean
   * @default true
   * @description 当设置该值为 `true` 时，遮罩层会阻止点击穿透
   */
  useBlock?: boolean;
  /**
   * 目标挂载元素
   * @type HTMLElement | undefined
   * @default undefined
   * @description 指定遮罩层挂载的目标元素
   */
  teleportTo?: HTMLElement;
};
/**
 * 组件事件类型
 * @description 定义组件可触发的事件
 */
export type ComponentEmits = {
  /**
   * 更新模型值事件
   * @param value - 新的模型值
   * @description 当遮罩层显示状态改变时触发
   */
  (e: "update:modelValue", value: boolean): void;
  /**
   * 点击遮罩层事件
   * @description 当点击遮罩层时触发
   */
  (e: "clickOverlay"): void;
};
