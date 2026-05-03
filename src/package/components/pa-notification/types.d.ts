/**
 * @module pa-notification/types
 * @description PaNotification 类型定义
 */
/**
 * 模块导入
 * @description 导入 Vue 虚拟节点类型
 */
import type { VNode, ComponentPublicInstance } from "vue";
/**
 * 模块导入
 * @description 导入多语言包类型
 */
import { LanguagePackageType } from "../manager-type";
/**
 * 通知类型
 * @description 定义通知的类型
 */
export type NotificationType = "danger" | "info" | "primary" | "success" | "warning";
/**
 * 通知位置类型
 * @description 定义通知显示的位置
 */
export type NotificationPosition = "bottom-left" | "bottom-right" | "top-left" | "top-right";
/**
 * 组件属性定义
 * @description 通知组件的配置选项
 */
/**
 * 组件属性
 * @type object
 * @description PaNotification 组件的属性类型定义
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
   * 通知标题
   * @type LanguagePackageType | string | undefined
   * @default undefined
   * @description 通知标题，支持多语言
   */
  title?: LanguagePackageType | string;
  /**
   * 通知内容
   * @type LanguagePackageType | string | undefined
   * @default undefined
   * @description 通知内容，支持多语言
   */
  message?: LanguagePackageType | string;
  /**
   * 通知类型
   * @type NotificationType | undefined
   * @default 'primary'
   * @description 通知类型，影响通知样式
   */
  type?: NotificationType;
  /**
   * 显示时间
   * @type number | undefined
   * @default 3000
   * @description 显示时间，单位毫秒，设为 0 则不会自动关闭
   */
  duration?: number;
  /**
   * 自定义类名
   * @type string | undefined
   * @default undefined
   * @description 自定义通知容器的类名
   */
  customClass?: string;
  /**
   * 点击回调
   * @type (() => void) | undefined
   * @default undefined
   * @description 点击通知时的回调函数
   */
  onClick?: () => void;
  /**
   * 关闭回调
   * @type (() => void) | undefined
   * @default undefined
   * @description 关闭通知时的回调函数
   */
  onClose?: () => void;
  /**
   * 偏移量
   * @type number | undefined
   * @default 20
   * @description 通知距离边缘的偏移量
   */
  offset?: number;
  /**
   * 显示位置
   * @type NotificationPosition | undefined
   * @default 'top-right'
   * @description 通知显示的位置
   */
  position?: NotificationPosition;
  /**
   * 是否使用HTML字符串
   * @type boolean | undefined
   * @default false
   * @description 是否使用 HTML 字符串渲染消息
   */
  dangerouslyUseHTMLString?: boolean;
  /**
   * 自定义图标
   * @type VNode | undefined
   * @default undefined
   * @description 自定义图标组件
   */
  icon?: VNode;
  /**
   * 层级
   * @type number | undefined
   * @default 2050
   * @description 通知的 z-index 值
   */
  zIndex?: number;
};
/**
 * 通知配置选项
 * @description 通知配置选项别名，与 ComponentProps 保持一致
 */
export type NotificationOptions = ComponentProps;
/**
 * 通知实例
 * @description 通知实例的类型定义
 */
export type NotificationInstance = {
  /**
   * 实例ID
   * @type string
   * @description 通知实例的唯一标识
   */
  id: string;
  /**
   * Vue组件实例
   * @type ComponentPublicInstance
   * @description 通知对应的 Vue 组件实例
   */
  vm: ComponentPublicInstance;
  /**
   * 配置选项
   * @type NotificationOptions
   * @description 通知的配置选项
   */
  options: NotificationOptions;
  /**
   * 关闭方法
   * @type () => void
   * @description 关闭通知的方法
   */
  close: () => void;
};
/**
 * 通知管理器类型
 * @description 通知管理器的类型定义
 */
export type NotificationManager = {
  /**
   * 通知列表
   * @type Array<NotificationInstance>
   * @description 当前所有通知实例
   */
  notifications: Array<NotificationInstance>;
  /**
   * 添加通知
   * @param options - 通知配置
   * @returns NotificationInstance 通知实例
   */
  add: (options: NotificationOptions) => NotificationInstance;
  /**
   * 关闭通知
   * @param id - 通知ID
   */
  close: (id: string) => void;
  /**
   * 关闭所有通知
   */
  closeAll: () => void;
  /**
   * 获取偏移量
   * @param position - 位置
   * @returns number 偏移量
   */
  getOffset: (position: string) => number;
  /**
   * 设置偏移量
   * @param id - 通知ID
   * @param offset - 偏移量
   */
  setOffset: (id: string, offset: number) => void;
};
