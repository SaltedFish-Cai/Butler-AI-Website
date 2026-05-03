/**
 * @module pa-message/types
 * @description PaMessage 类型定义
 */
/**
 * 模块导入
 * @description 导入 Vue 组件实例类型
 */
import type { ComponentPublicInstance } from "vue";
/**
 * 模块导入
 * @description 导入多语言包类型
 */
import { LanguagePackageType } from "../manager-type";
/**
 * 消息类型
 * @description 定义消息提示的类型
 */
export type MessageType = "danger" | "info" | "success" | "warning";
/**
 * 组件属性定义
 * @description 消息提示组件的配置选项
 */
/**
 * 组件属性
 * @type object
 * @description PaMessage 组件的属性类型定义
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
   * 消息标题
   * @type LanguagePackageType | string | undefined
   * @default undefined
   * @description 消息标题，支持多语言
   */
  title?: LanguagePackageType | string;
  /**
   * 消息内容
   * @type LanguagePackageType | string | undefined
   * @default undefined
   * @description 消息内容，支持多语言
   */
  message?: LanguagePackageType | string;
  /**
   * 消息类型
   * @type MessageType | undefined
   * @default 'info'
   * @description 消息类型，影响消息样式
   */
  type?: MessageType;
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
   * @description 自定义消息容器的类名
   */
  customClass?: string;
  /**
   * 偏移量
   * @type number | undefined
   * @default 20
   * @description 消息距离顶部的偏移量
   */
  offset?: number;
  /**
   * 是否使用HTML字符串
   * @type boolean | undefined
   * @default false
   * @description 是否使用 HTML 字符串渲染消息
   */
  dangerouslyUseHTMLString?: boolean;
  /**
   * 层级
   * @type number | undefined
   * @default 2050
   * @description 消息的 z-index 值
   */
  zIndex?: number;
  /**
   * 点击回调
   * @type (() => void) | undefined
   * @default undefined
   * @description 点击消息时的回调函数
   */
  onClick?: () => void;
  /**
   * 关闭回调
   * @type (() => void) | undefined
   * @default undefined
   * @description 消息关闭时的回调函数
   */
  onClose?: () => void;
  /**
   * ESC键关闭
   * @type boolean | undefined
   * @default true
   * @description 是否在按下 ESC 键时关闭消息
   */
  closeOnPressEscape?: boolean;
};
/**
 * 消息配置选项
 * @description 消息配置选项别名，与 ComponentProps 保持一致
 */
export type MessageOptions = ComponentProps;
/**
 * 消息实例
 * @description 消息实例的类型定义
 */
export type MessageInstance = {
  /**
   * 实例ID
   * @type string
   * @description 消息实例的唯一标识
   */
  id: string;
  /**
   * Vue组件实例
   * @type ComponentPublicInstance
   * @description 消息对应的 Vue 组件实例
   */
  vm: ComponentPublicInstance;
  /**
   * 配置选项
   * @type MessageOptions
   * @description 消息的配置选项
   */
  options: MessageOptions;
  /**
   * 关闭方法
   * @type () => void
   * @description 关闭消息的方法
   */
  close: () => void;
};
/**
 * 消息管理器类型
 * @description 消息管理器的类型定义
 */
export type MessageManagerType = {
  /**
   * 消息列表
   * @type Array<MessageInstance>
   * @description 当前所有消息实例
   */
  Messages: Array<MessageInstance>;
  /**
   * 添加消息
   * @param options - 消息配置
   * @returns MessageInstance 消息实例
   */
  add: (options: MessageOptions) => MessageInstance;
  /**
   * 关闭消息
   * @param id - 消息ID
   */
  close: (id: string) => void;
  /**
   * 关闭所有消息
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
   * @param id - 消息ID
   * @param offset - 偏移量
   */
  setOffset: (id: string, offset: number) => void;
};
