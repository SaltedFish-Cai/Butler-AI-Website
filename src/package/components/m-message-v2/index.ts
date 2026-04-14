import type { MessageOptions, MessageInstance } from "./type";
import { MessageManager } from "./message-manager";

// 主通知函数
export function Message(options: MessageOptions | string): MessageInstance {
  // 处理字符串参数情况
  if (typeof options === "string") {
    return MessageManager.add({
      message: options
    });
  }

  return MessageManager.add(options);
}

// 快捷方法
Message.success = (options: MessageOptions | string): MessageInstance => {
  if (typeof options === "string") {
    return Message({ message: options, type: "success" });
  }
  return Message({ ...options, type: "success" });
};

Message.warning = (options: MessageOptions | string): MessageInstance => {
  if (typeof options === "string") {
    return Message({ message: options, type: "warning" });
  }
  return Message({ ...options, type: "warning" });
};

Message.danger = (options: MessageOptions | string): MessageInstance => {
  if (typeof options === "string") {
    return Message({ message: options, type: "error" });
  }
  return Message({ ...options, type: "error" });
};

Message.info = (options: MessageOptions | string): MessageInstance => {
  if (typeof options === "string") {
    return Message({ message: options, type: "info" });
  }
  return Message({ ...options, type: "info" });
};

// 关闭所有通知
Message.closeAll = (): void => {
  MessageManager.closeAll();
};

export default Message;
