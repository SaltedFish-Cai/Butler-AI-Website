/**
 * 模块导入
 * @description 导入消息配置和实例类型
 */
import type { MessageOptions, MessageInstance, MessageType } from "./types";
/**
 * 模块导入
 * @description 导入消息管理器
 */
import { MessageManager } from "./message-manager";
import { LanguagePackageType } from "../manager-type";
/**
 * 消息提示函数
 * @param options - 消息配置或消息内容
 * @returns MessageInstance 消息实例
 * @description 显示消息提示，支持字符串或配置对象参数
 */
export function Message(options: MessageOptions | string): MessageInstance {
  if (typeof options === "string") {
    return MessageManager.add({
      message: options
    });
  }
  return MessageManager.add(options);
}
/**
 * 成功消息
 * @param options - 消息配置或消息内容
 * @returns MessageInstance 消息实例
 * @description 显示成功类型的消息提示
 */
Message.success = function (options: LanguagePackageType | MessageOptions | string): MessageInstance {
  return createMessage("success", options);
};
/**
 * 警告消息
 * @param options - 消息配置或消息内容
 * @returns MessageInstance 消息实例
 * @description 显示警告类型的消息提示
 */
Message.warning = function (options: LanguagePackageType | MessageOptions | string): MessageInstance {
  return createMessage("warning", options);
};
/**
 * 危险消息
 * @param options - 消息配置或消息内容
 * @returns MessageInstance 消息实例
 * @description 显示危险类型的消息提示
 */
Message.danger = function (options: LanguagePackageType | MessageOptions | string): MessageInstance {
  return createMessage("danger", options);
};
/**
 * 信息消息
 * @param options - 消息配置或消息内容
 * @returns MessageInstance 消息实例
 * @description 显示信息类型的消息提示
 */
Message.info = function (options: LanguagePackageType | MessageOptions | string): MessageInstance {
  return createMessage("info", options);
};

function createMessage(type: string, options: LanguagePackageType | MessageOptions | string): MessageInstance {
  const language = (typeof window !== "undefined" && window.PancakeGlobalConfig?.language) || "zh-CN";
  // 纯字符串 → 直接显示
  if (typeof options === "string") {
    return Message({ message: options, type: type as MessageType | undefined });
  }
  // 判断是否为 LanguagePackageType（仅有 en-US/zh-CN 两个键）
  const keys = Object.keys(options);
  const isLanguagePackage = keys.length > 0 && keys.every(k => k === "en-US" || k === "zh-CN");
  if (isLanguagePackage) {
    return Message({ message: (options as LanguagePackageType)[language] || "", type: type as MessageType | undefined });
  }
  // MessageOptions 配置对象
  return Message({ type: type as MessageType | undefined, ...(options as MessageOptions) });
}
/**
 * 关闭所有消息
 * @description 关闭所有当前显示的消息
 */
Message.closeAll = function (): void {
  MessageManager.closeAll();
};
export default Message;
