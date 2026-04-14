import type { MessageBoxOptions, MessageBoxInstance } from "./type";
import { messageBoxManager } from "./m-message-box-manager";
import { useZIndex } from "element-plus";
/**
 * # 获取全局 Z 索引
 */
const { nextZIndex } = useZIndex();

// 主通知函数
export function MessageBox(options: MessageBoxOptions | string): MessageBoxInstance {
  // 处理字符串参数情况
  if (typeof options === "string") {
    return messageBoxManager.add({
      message: options,
      zIndex: nextZIndex() || window.globalZIndex++
    });
  }

  return messageBoxManager.add({
    ...options,
    zIndex: nextZIndex() || window.globalZIndex++
  });
}

// 快捷方法
MessageBox.confirm = (options: MessageBoxOptions | string, onConfirm?: () => void): MessageBoxInstance => {
  const baseOptions = {
    title: { "en-US": "Tips", "zh-CN": "温馨提示" },
    message: { "en-US": "Are you sure？", "zh-CN": "是否继续?" },
    type: "warning" as const,
    confirmButtonText: { "en-US": "Confirm", "zh-CN": "确定" },
    cancelButtonText: { "en-US": "Cancel", "zh-CN": "取消" }
  };
  if (typeof options === "string") {
    return MessageBox({ ...baseOptions, message: options, onConfirm, isType: "confirm" });
  }
  return MessageBox({ ...baseOptions, ...options, isType: "confirm" });
};

// 快捷方法
MessageBox.delete = (options: MessageBoxOptions | string): MessageBoxInstance => {
  const baseOptions = {
    title: { "en-US": "Tips", "zh-CN": "注意" },
    message: { "en-US": "Are you sure to delete this data?", "zh-CN": "是否删除数据?" },
    type: "danger" as const,
    confirmButtonText: { "en-US": "Delete", "zh-CN": "删除" },
    cancelButtonText: { "en-US": "Cancel", "zh-CN": "取消" }
  };
  if (typeof options === "string") {
    return MessageBox({ message: options, isType: "confirm" });
  }
  return MessageBox({ ...baseOptions, ...options, isType: "confirm" });
};

export default MessageBox;
