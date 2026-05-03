/**
 * 模块导入
 * @description 导入消息配置和实例类型
 */
import type { MessageOptions, MessageInstance } from "./types.d.ts";
/**
 * 模块导入
 * @description 导入消息管理器
 */
import { MessageManager } from "./message-manager";
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
Message.success = (options: MessageOptions | string): MessageInstance => {
  if (typeof options === "string") {
    return Message({ message: options, type: "success" });
  }
  return Message({ ...options, type: "success" });
};
/**
 * 警告消息
 * @param options - 消息配置或消息内容
 * @returns MessageInstance 消息实例
 * @description 显示警告类型的消息提示
 */
Message.warning = (options: MessageOptions | string): MessageInstance => {
  if (typeof options === "string") {
    return Message({ message: options, type: "warning" });
  }
  return Message({ ...options, type: "warning" });
};
/**
 * 危险消息
 * @param options - 消息配置或消息内容
 * @returns MessageInstance 消息实例
 * @description 显示危险类型的消息提示
 */
Message.danger = (options: MessageOptions | string): MessageInstance => {
  if (typeof options === "string") {
    return Message({ message: options, type: "danger" });
  }
  return Message({ ...options, type: "danger" });
};
/**
 * 信息消息
 * @param options - 消息配置或消息内容
 * @returns MessageInstance 消息实例
 * @description 显示信息类型的消息提示
 */
Message.info = (options: MessageOptions | string): MessageInstance => {
  if (typeof options === "string") {
    return Message({ message: options, type: "info" });
  }
  return Message({ ...options, type: "info" });
};
/**
 * 关闭所有消息
 * @description 关闭所有当前显示的消息
 */
Message.closeAll = (): void => {
  MessageManager.closeAll();
};
export default Message;
