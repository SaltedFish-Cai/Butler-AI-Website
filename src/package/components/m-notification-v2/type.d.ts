import type { VNode, ComponentPublicInstance } from "vue";

// 通知类型
export type NotificationType = "error" | "info" | "success" | "warning";

// 通知配置接口
export interface NotificationOptions {
  /**
   * 通知标题
   */
  title?: Record<languageKey, string> | string;
  /**
   * 通知消息
   */
  message?: strRecord<languageKey, string> | string;
  /**
   * 通知类型
   */
  type?: NotificationType;
  /**
   * 显示时间，单位为毫秒，设为0则不会自动关闭
   */
  duration?: number;
  /**
   * 自定义样式
   */
  customClass?: string;
  /**
   * 点击通知时的回调函数
   */
  onClick?: () => void;
  /**
   * 关闭通知时的回调函数
   */
  onClose?: () => void;
  /**
   * 偏移量
   */
  offset?: number;
  /**
   * 位置
   */
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  /**
   * 是否使用HTML
   */
  dangerouslyUseHTMLString?: boolean;
  /**
   * 自定义图标组件
   */
  icon?: VNode;
  /**
   * z-index
   */
  zIndex?: number;
}

// 通知实例接口
export interface NotificationInstance {
  id: string;
  vm: ComponentPublicInstance;
  options: NotificationOptions;
  close: () => void;
}

// 通知管理器接口
export interface NotificationManager {
  notifications: NotificationInstance[];
  add: (options: NotificationOptions) => NotificationInstance;
  close: (id: string) => void;
  closeAll: () => void;
  getOffset: (position: string) => number;
  setOffset: (id: string, offset: number) => void;
}
