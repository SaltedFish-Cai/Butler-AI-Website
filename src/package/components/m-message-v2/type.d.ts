import type { ComponentPublicInstance } from "vue";

// 通知类型
export type MessageType = "error" | "info" | "success" | "warning";

type languageKey = "en-US" | "zh-CN";

// 通知配置接口
export interface MessageOptions {
  /**
   * 通知标题
   */
  title?: Record<languageKey, string> | string;
  /**
   * 通知消息
   */
  message?: Record<languageKey, string> | string;
  /**
   * 通知类型
   */
  type?: MessageType;
  /**
   * 显示时间，单位为毫秒，设为0则不会自动关闭
   */
  duration?: number;
  /**
   * 自定义样式
   */
  customClass?: string;
  /**
   * 确认回调
   */
  onClick?: () => void;
  /**
   * 取消回调
   */
  onClose?: () => void;
  /**
   * 偏移量
   */
  offset?: number;
  /**
   * 是否使用HTML
   */
  dangerouslyUseHTMLString?: boolean;
  /**
   * z-index
   */
  zIndex?: number;
}

// 通知实例接口
export interface MessageInstance {
  id: string;
  vm: ComponentPublicInstance;
  options: MessageOptions;
  close: () => void;
}

// 通知管理器接口
export interface MessageManagerType {
  Messages: MessageInstance[];
  add: (options: MessageOptions) => MessageInstance;
  close: (id: string) => void;
  closeAll: () => void;
  getOffset: (position: string) => number;
  setOffset: (id: string, offset: number) => void;
}
