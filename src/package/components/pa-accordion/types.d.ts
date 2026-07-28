/**
 * 组件属性定义
 */
export type PaAccordionProps = {
  /**
   * 组件唯一标识
   * @type string | undefined
   */
  id?: string;
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
   * 单展开模式
   * @type boolean | undefined
   * @default false
   * @description 开启后同一时间只允许展开一个面板
   */
  singleExpand?: boolean;
};

/**
 * 手风琴上下文类型
 * @description 用于 provide/inject 通信
 */
export type PaAccordionContext = {
  singleExpand: boolean;
  activeItemId: import("vue").Ref<string>;
  setActiveItemId: (id: string) => void;
  registerSentinel: (el: HTMLElement, onStuckChange: (stuck: boolean) => void) => void;
  unregisterSentinel: (el: HTMLElement) => void;
  randId: string;
};

/**
 * 手风琴项属性定义
 */
export type PaAccordionItemProps = {
  /**
   * 组件唯一标识
   * @type string | undefined
   */
  id?: string;
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
   * 内边距方向
   * @type Array<'all' | 'bottom' | 'left' | 'right' | 'top'> | undefined
   * @default undefined
   * @description 设置抽屉弹窗内容的内边距方向
   */
  padding?: Array<"all" | "bottom" | "left" | "right" | "top">;
  /**
   * 是否展开
   * @type boolean | undefined
   * @default false
   */
  expanded?: boolean;
  /**
   * 是否禁用
   * @type boolean | undefined
   * @default false
   */
  disabled?: boolean;
};

/**
 * 手风琴项事件定义
 */
export type PaAccordionItemEmits = {
  /**
   * 展开状态更新事件
   * @param value - 展开状态
   */
  (e: "update:expanded", value: boolean): void;
};

/**
 * 手风琴项插槽定义
 */
export type PaAccordionItemSlots = {
  /**
   * 头部插槽
   * @param scope - 作用域参数
   */
  header?: (scope: { expanded: boolean; toggle: () => void }) => unknown;
  /**
   * 默认内容插槽
   * @param scope - 作用域参数
   */
  default?: (scope: { expanded: boolean }) => unknown;
};
