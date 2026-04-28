import type { ComponentPublicInstance } from "vue";
import { LanguagePackageType } from "../manager-type";

// 通知类型
export type MessageType = "danger" | "info" | "success" | "warning";

// 通知配置接口
export interface MessageOptions {
  /**
   * 通知标题
   */
  title?: LanguagePackageType | string;
  /**
   * 通知消息
   */
  message?: LanguagePackageType | string;
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
  /**
   * 是否在按下ESC键时关闭通知
   */
  closeOnPressEscape?: boolean;
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
